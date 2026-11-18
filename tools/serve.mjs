// Tiny static file server: node tools/serve.mjs  ->  http://localhost:8123
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/plain' };
const root = process.cwd();
createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0]);
  if (path.includes('..')) { res.writeHead(400); res.end(); return; }
  if (path === '/') path = '/index.html';
  try {
    const data = await readFile(join(root, path));
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('not found'); }
}).listen(8123, () => console.log('Bunny game at http://localhost:8123'));
