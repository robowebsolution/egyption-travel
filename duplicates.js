const fs = require('fs');

// عدل المسار حسب مكان ملف الترجمة لديك
const filePath = './src/contexts/LanguageContext.tsx';

const file = fs.readFileSync(filePath, 'utf8');

// استخراج كائنات الترجمة لكل لغة
const langBlocks = {};
const langRegex = /(\w+):\s*{([^}]+)}/g;
let match;
while ((match = langRegex.exec(file))) {
  const lang = match[1];
  const body = match[2];
  langBlocks[lang] = body;
}

Object.entries(langBlocks).forEach(([lang, body]) => {
  const keys = [];
  const keyRegex = /'([^']+)':/g;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(body))) {
    keys.push(keyMatch[1]);
  }
  const duplicates = keys.filter((key, idx) => keys.indexOf(key) !== idx);
  if (duplicates.length) {
    console.log(`\n[${lang}] المفاتيح المكررة:`);
    [...new Set(duplicates)].forEach((dup) => console.log(' -', dup));
  }
});

console.log('\nانتهى البحث عن التكرارات.');