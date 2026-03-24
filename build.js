const fs = require('fs');
const path = require('path');

const MOTS_DIR = path.join(__dirname, 'mots');
const TEMPLATE = path.join(__dirname, 'template.html');
const OUTPUT = path.join(__dirname, 'public', 'index.html');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content.trim() };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  });

  return { meta, body: match[2].trim() };
}

function parseWord(filename, content) {
  const { meta, body } = parseFrontmatter(content);
  const word = path.basename(filename, '.md');

  const lines = body.split('\n');
  const defLines = [];
  const examples = [];

  for (const line of lines) {
    if (line.startsWith('> ')) {
      examples.push(line.slice(2));
    } else if (line.trim()) {
      defLines.push(line.trim());
    }
  }

  const result = {
    word,
    nature: meta.nature || '',
    domain: meta.domaine || '',
    def: defLines.join(' '),
    extra: meta.extra || '',
    examples,
  };
  if (meta.source) result.source = meta.source;
  if (meta.tag) result.tag = meta.tag;
  return result;
}

const files = fs.readdirSync(MOTS_DIR).filter(f => f.endsWith('.md'));
const words = files.map(f => {
  const content = fs.readFileSync(path.join(MOTS_DIR, f), 'utf8');
  return parseWord(f, content);
});

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

const template = fs.readFileSync(TEMPLATE, 'utf8');
const output = template.replace('__WORDS_DATA__', JSON.stringify(words));

fs.writeFileSync(OUTPUT, output);
console.log(`${words.length} mots -> ${OUTPUT}`);
