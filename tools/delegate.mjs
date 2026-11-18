// Hand one file-writing job to a local Ollama model.
// usage: node tools/delegate.mjs <model> <outFile> <taskFile> [contextFile...]
// Add a line "PREVIOUS ERROR: ..." to the task file to retry with feedback.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [model, outFile, taskFile, ...ctxFiles] = process.argv.slice(2);
const spec = readFileSync('SPEC.md', 'utf8').replace('STATE_JS_HERE', readFileSync('src/state.js', 'utf8'));
let prompt = spec + '\n\n';
for (const f of ctxFiles) prompt += `## Existing file ${f}\n\`\`\`\n${readFileSync(f, 'utf8')}\n\`\`\`\n\n`;
prompt += `# YOUR JOB\nWrite the complete file \`${outFile}\`.\n${readFileSync(taskFile, 'utf8')}\n\n` +
  'Rules: follow the contract above exactly (names, signatures, imports). Import only from the files listed ' +
  'in the contract, using relative paths like `./draw.js`. Only call functions that exist in the contract. ' +
  'No placeholders, no TODOs, no omitted parts. Reply with the whole file in ONE fenced code block and nothing else.';

const t0 = Date.now();
// node:http has no header timeout, so slow local models are fine.
const { request } = await import('node:http');
const res = await new Promise((resolve, reject) => {
  const req = request('http://localhost:11434/api/chat', { method: 'POST' }, resolve);
  req.on('error', reject);
  req.end(JSON.stringify({
    model, stream: true, think: false,
    options: { num_ctx: Number(process.env.NUM_CTX || 12288), temperature: 0.2, num_predict: Number(process.env.NUM_PREDICT || 8000) },
    messages: [
      { role: 'system', content: 'You are a careful senior JavaScript game programmer. You write complete, working, bug-free code.' },
      { role: 'user', content: prompt },
    ],
  }));
});
let text = '';
let buf = '';
const dec = new TextDecoder();
for await (const chunk of res) {
  buf += dec.decode(chunk, { stream: true });
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    if (line.trim()) { const j = JSON.parse(line); if (j.error) throw new Error(j.error); text += j.message?.content || ''; }
  }
}
const blocks = [...text.matchAll(/```[a-zA-Z]*\n([\s\S]*?)```/g)].map((m) => m[1]);
const code = blocks.length ? blocks.sort((a, b) => b.length - a.length)[0] : text;
writeFileSync(outFile, code);
const secs = Math.round((Date.now() - t0) / 1000);
let check = 'n/a';
if (outFile.endsWith('.js')) {
  try { execFileSync(process.execPath, ['--check', outFile], { stdio: 'pipe' }); check = 'syntax OK'; }
  catch (e) { check = 'SYNTAX ERROR: ' + String(e.stderr).slice(0, 600); }
}
console.log(`${outFile}: ${code.split('\n').length} lines, ${secs}s, ${model}, ${check}`);
