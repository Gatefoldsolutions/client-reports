// lib/users.ts
export type Role = 'admin' | 'client';

export type UserRecord = {
  password: string;
  role: Role;
};

function parseUserCreds(raw: string): Record<string, UserRecord> {
  const out: Record<string, UserRecord> = {};
  if (!raw) return out;

  // Format: email:password,email2:password2,...
  for (const pair of raw.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [email, password] = pair.split(':');
    if (!email || !password) continue;
    out[email.toLowerCase()] = { password, role: 'client' };
  }
  return out;
}

/** Build the in-memory user table from env:
 * - ADMIN_EMAIL / ADMIN_PASSWORD (role: admin)
 * - USER_CREDENTIALS (comma-separated list of email:password for clients)
 */
export function getUserTable(): Record<string, UserRecord> {
  const table: Record<string, UserRecord> = {};

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    table[adminEmail] = { password: adminPassword, role: 'admin' };
  }

  const userCreds = process.env.USER_CREDENTIALS ?? '';
  const clients = parseUserCreds(userCreds);
  for (const [email, rec] of Object.entries(clients)) {
    table[email] = rec;
  }
  return table;
}
