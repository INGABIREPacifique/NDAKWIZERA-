// This file is intentionally left as a tombstone.
// The request-otp route has been removed — it was an orphaned mock OTP
// generator that never wrote to auth_sessions and was not called by anything.
// Real OTP flow goes through /api/auth/signup (signup) and /api/auth/login (login).
// DELETE THIS FILE — replaced by empty redirect marker only to trigger git diff.
export {}
