import { verifyToken } from './auth';

export function getUserFromRequest(req) {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!m) return null;
  const token = decodeURIComponent(m[1]);
  const claims = verifyToken(token);
  if (!claims) return null;
  return { id: claims.id, username: claims.username };
}
