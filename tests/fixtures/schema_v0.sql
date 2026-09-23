PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published'))
);

CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    context TEXT NOT NULL DEFAULT '',
    data_materials TEXT NOT NULL DEFAULT '',
    expected_result TEXT NOT NULL DEFAULT '',
    success_criteria TEXT NOT NULL DEFAULT '',
    constraints TEXT NOT NULL DEFAULT '',
    users TEXT NOT NULL DEFAULT '',
    business_contact TEXT NOT NULL DEFAULT '',
    context_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (context_confirmed IN (0, 1)),
    data_materials_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (data_materials_confirmed IN (0, 1)),
    expected_result_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (expected_result_confirmed IN (0, 1)),
    success_criteria_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (success_criteria_confirmed IN (0, 1)),
    constraints_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (constraints_confirmed IN (0, 1)),
    users_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (users_confirmed IN (0, 1)),
    business_contact_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK (business_contact_confirmed IN (0, 1)),
    rating INTEGER NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 100),
    readiness_level TEXT NOT NULL DEFAULT 'проект'
        CHECK (readiness_level IN ('проект', 'в работе', 'готово', 'приоритет')),
    published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1))
);

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    interests TEXT NOT NULL DEFAULT '',
    skills TEXT NOT NULL DEFAULT '',
    technologies TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL REFERENCES cards(id),
    team_id INTEGER NOT NULL REFERENCES teams(id),
    solution_idea TEXT NOT NULL DEFAULT '',
    plan TEXT NOT NULL DEFAULT '',
    prototype_link TEXT NOT NULL DEFAULT '',
    deadline TEXT NOT NULL DEFAULT '',
    chosen INTEGER NOT NULL DEFAULT 0 CHECK (chosen IN (0, 1))
);
