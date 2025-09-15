// lib/db.js
import mysql from 'mysql2/promise';

function buildSsl() {
  const mode = (process.env.DB_SSL_MODE || 'off').toLowerCase();

  // No TLS (local dev to 127.0.0.1 or a non-TLS MySQL)
  if (mode === 'off') return undefined;

  // TLS required, but no client certs (PlanetScale, many shared hosts/RDS defaults)
  if (mode === 'require') {
    return { rejectUnauthorized: true, minVersion: 'TLSv1.2' };
  }

  // Custom TLS (self-managed, Cloud SQL mTLS, RDS with custom CA)
  if (mode === 'custom') {
    const fs = require('fs');
    const path = require('path');
    const read = (p) => (p ? fs.readFileSync(path.resolve(p), 'utf8') : undefined);

    return {
      // CA is the *server* CA certificate
      ca: read(process.env.DB_SSL_CA),
      // These two are *client* credentials (only if your server requires client auth)
      cert: read(process.env.DB_SSL_CERT),
      key: read(process.env.DB_SSL_KEY),
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    };
  }

  // Fallback (same as your current behavior)
  return { minVersion: 'TLSv1.2' };
}

const createPool = () =>
  mysql.createPool({
    host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'app',
    port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
    ssl: buildSsl(),
  });

// reuse in dev (HMR) so we don't open new pools
const g = globalThis;
export const pool = g._mysqlPool ?? createPool();
if (process.env.NODE_ENV !== 'production') g._mysqlPool = pool;
