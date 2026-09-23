"""Exercise the real PHP/SQLite API in a disposable copy; no production DB writes."""
import argparse
from contextlib import closing
import json
import os
from pathlib import Path
import shutil
import socket
import sqlite3
import subprocess
import tempfile
import time
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--php", default="php")
    args = parser.parse_args()
    php = shutil.which(args.php) or args.php
    command = [php]
    modules = subprocess.check_output([php, "-m"], text=True)
    extension = Path(php).resolve().parent / "ext" / "php_pdo_sqlite.dll"
    if "pdo_sqlite" not in modules and extension.exists():
        command += ["-d", f"extension_dir={extension.parent}", "-d", "extension=pdo_sqlite"]
    source = Path(__file__).resolve().parent.parent
    env = os.environ.copy()
    env.pop("AI_API_KEY", None)
    checks = 0

    def check(condition, label):
        nonlocal checks
        if not condition:
            raise AssertionError(label)
        checks += 1

    with tempfile.TemporaryDirectory(prefix="ai-sana-api-") as directory:
        root = Path(directory)
        for name in ["ai_helper.php", "db.php", "rating.php", "schema.sql", "seed.php"]:
            shutil.copy2(source / name, root / name)
        shutil.copytree(source / "api", root / "api")
        shutil.copytree(source / "data", root / "data")
        subprocess.run(command + ["seed.php"], cwd=root, env=env, check=True, capture_output=True)
        with closing(sqlite3.connect(root / "database.sqlite")) as db:
            baseline = db.execute("SELECT id, chosen FROM proposals ORDER BY id").fetchall()
            count_before = db.execute("SELECT COUNT(*) FROM cards").fetchone()[0]
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        with (root / "server.log").open("wb") as log:
            process = subprocess.Popen(
                command + ["-S", f"127.0.0.1:{port}", "-t", str(root)],
                cwd=root, env=env, stdout=log, stderr=log,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )

            def request(method, path, data=None):
                payload = None if data is None else json.dumps(data, ensure_ascii=False).encode("utf-8")
                req = urllib.request.Request(
                    f"http://127.0.0.1:{port}/api/{path}", data=payload, method=method,
                    headers={"Content-Type": "application/json"},
                )
                try:
                    response = urllib.request.urlopen(req, timeout=5)
                except urllib.error.HTTPError as error:
                    response = error
                with response:
                    return response.status, json.load(response)

            try:
                for _ in range(50):
                    try:
                        request("OPTIONS", "cards.php")
                        break
                    except urllib.error.URLError:
                        time.sleep(0.1)
                else:
                    raise RuntimeError("PHP server did not start")

                raw = "Нужен прогноз продаж магазина."
                status, task = request("POST", "tasks.php", {"raw_description": raw})
                check(status == 201, "draft creation")
                task_id = task["task_id"]
                status, questions = request("POST", "cards.php", {"action": "questions", "task_id": task_id})
                check(status == 200 and len(questions["questions"]) >= 3, "questions for saved draft")
                check(all(set(q) == {"field", "question"} for q in questions["questions"]), "question shape")
                with closing(sqlite3.connect(root / "database.sqlite")) as db:
                    check(db.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == count_before, "questions do not insert a card")

                answers = {"users": "Управляющий магазина.", "business_contact": "Отдел продаж."}
                status, created = request("POST", "cards.php", {"action": "build", "task_id": task_id, "answers": answers})
                check(status == 201 and "card_id" in created, "build and save")
                status, card = request("GET", f"cards.php?id={created['card_id']}")
                check(status == 200 and card["context"] == raw and card["users"] == answers["users"], "saved values verbatim")
                check(card["data_materials"] == "" and card["constraints"] == "", "no invented facts")
                check(all(value == 0 for key, value in card.items() if key.endswith("_confirmed")), "no automatic confirmations")
                check(card["rating"] == 0 and card["published"] == 0, "no automatic score or publication")
                status, updated = request("PATCH", "cards.php", {"id": created["card_id"], "field": "context", "value": raw})
                check(status == 200 and updated["context_confirmed"] == 1 and updated["rating"] == 20, "manual confirmation updates rating")
                check(updated["users_confirmed"] == 0, "other fields remain unconfirmed")
                with closing(sqlite3.connect(root / "database.sqlite")) as db:
                    check(db.execute("SELECT id, chosen FROM proposals ORDER BY id").fetchall() == baseline, "team choices untouched")
                    check(db.execute("SELECT status FROM tasks WHERE id=?", (task_id,)).fetchone()[0] == "draft", "task still a draft")

                for bad, expected in [
                    ({"action": "choose", "task_id": task_id}, 400),
                    ({"action": "questions", "task_id": task_id, "raw_description": "override"}, 400),
                    ({"action": "questions", "task_id": 999999}, 404),
                    ({"action": "build", "task_id": task_id}, 400),
                    ({"action": "build", "task_id": task_id, "answers": []}, 400),
                    ({"action": "build", "task_id": task_id, "answers": {"users": None}}, 422),
                    ({"action": "build", "task_id": task_id, "answers": {"unknown": "value"}}, 422),
                    ({"action": "build", "task_id": task_id, "answers": {"business_contact": "person@example.com"}}, 422),
                    ({"action": "build", "task_id": task_id, "answers": {"users": "Рекомендуем команду Alpha."}}, 422),
                ]:
                    status, error = request("POST", "cards.php", bad)
                    check(status == expected and "error" in error, "invalid input rejected")
                    check("person@example.com" not in json.dumps(error), "PII is not echoed in errors")
                with closing(sqlite3.connect(root / "database.sqlite")) as db:
                    check(db.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == count_before + 1, "failed builds do not insert rows")
                status, _ = request("POST", "cards.php", {"task_id": task_id, "context": "Ручной черновик"})
                check(status == 201, "legacy manual POST remains compatible")
                status, _ = request("POST", "cards.php", {"action": "build", "task_id": task_id, "answers": {}})
                check(status == 201, "empty answer object accepted")
            finally:
                process.terminate()
                process.wait(timeout=5)
        print(f"OK: {checks} HTTP/SQLite checks (disposable database)")


if __name__ == "__main__":
    main()
