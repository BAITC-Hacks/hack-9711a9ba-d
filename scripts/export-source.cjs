const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const frontend = path.join(root,'frontend');
const files = fs.readdirSync(frontend,{recursive:true})
  .filter(file => /\.(html|css|js)$/.test(file)).sort();
const chunks = ['# AI Sana — полный исходный код\n\nФайлы сохранены в frontend/. Для копирования используйте соответствующие имена и пути.\n'];
for (const file of files) {
  const language = path.extname(file).slice(1);
  chunks.push(`\n## frontend/${file.replaceAll('\\','/')}\n\n\`\`\`${language}\n${fs.readFileSync(path.join(frontend,file),'utf8')}\n\`\`\`\n`);
}
fs.writeFileSync(path.join(root,'SOURCE_CODE.md'),chunks.join(''),'utf8');
console.log(`SOURCE_CODE.md: ${files.length} файлов`);
