import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

// Get the directory where server.js is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  console.log('📨 Request received:', req.url);

  let pathname = url.parse(req.url).pathname;

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(__dirname, pathname);
  console.log('🔍 Looking for file:', filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.ico': 'image/x-icon'
  };

  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log('❌ ReadFile error:', error.code, 'for file:', filePath);
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('❌ File not found: ' + pathname + '\n🔍 Looking for: ' + filePath);
      } else {
        res.writeHead(500);
        res.end('💥 Server error: ' + error.code + '\n' + error.message);
      }
    } else {
      console.log('✅ Successfully served:', filePath, '(' + content.length + ' bytes)');
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🚀 ShareBite Server Started Successfully!');
  console.log('🚀 ========================================');
  console.log('🌐 Access your website at: http://localhost:' + PORT);
  console.log('📁 Serving files from:', __dirname);
  console.log('🚀 ========================================');
});
