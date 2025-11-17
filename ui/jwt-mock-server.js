#!/usr/bin/env node

/**
 * Simple JWT Mock Server
 * Generates JWT tokens for testing without crypto.subtle
 * 
 * Usage: node jwt-mock-server.js
 * Runs on http://localhost:3001
 */

const http = require('http');
const crypto = require('crypto');

const JWT_SECRET = 'your_super_secure_jwt_secret_32_characters_minimum';
const JWT_ISSUER = 'collabornest';
const JWT_AUDIENCE = 'collabornest-users';
const PORT = 3001;

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateJWT(userId, username, email) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    username: username,
    email: email,
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    iat: now,
    exp: now + 3600
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerEncoded}.${payloadEncoded}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${dataToSign}.${signature}`;
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/auth/generate-token') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { userId, username, email } = JSON.parse(body);
        
        if (!userId || !username || !email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields' }));
          return;
        }

        const token = generateJWT(userId, username, email);
        
        console.log(`[JWT] ✅ Token generated for ${username} (${userId})`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          token,
          expiresIn: 3600,
          user: { userId, username, email }
        }));
      } catch (error) {
        console.error('[JWT] ❌ Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'JWT Mock Server' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   JWT Mock Server                            ║
╚══════════════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}

📍 Endpoints:
  POST /auth/generate-token
    Body: { "userId": "...", "username": "...", "email": "..." }
    Returns: { "token": "eyJ..." }

  GET /health
    Returns: { "status": "ok" }

🔐 Generating JWT tokens for CollaborNest testing
⚠️  For development/testing only - NOT for production!

Press Ctrl+C to stop
`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down JWT Mock Server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
