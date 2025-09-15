import { verifyToken } from '@/lib/auth';

export function getUserFromRequest(req) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded?.id) return null;
  return { id: decoded.id, username: decoded.username };
}
