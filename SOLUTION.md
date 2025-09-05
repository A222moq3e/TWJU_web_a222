# CTF Solution Guide

## Challenge Overview

This is a Local File Inclusion (LFI) challenge that leads to JWT secret extraction and privilege escalation.

## Intended Solve Path

### Step 1: Register and Login

1. Register a new account or use the test account: `john.doe@student.local` / `student123`
2. Login to access the student dashboard

### Step 2: Discover the LFI Vulnerability

1. On the student dashboard, notice that if a user doesn't have an avatar set, the frontend automatically attempts to load an avatar image
2. The avatar request goes to: `/api/media/file?userId=<userId>&file=avatar.png`
3. This triggers the vulnerable backend endpoint at `GET /media/file`

### Step 3: Exploit the LFI

The `/media/file` endpoint has a path traversal vulnerability:

1. **Intercept the avatar request** using a proxy tool (Burp Suite, OWASP ZAP, or browser dev tools)
2. **Modify the `file` parameter** to perform directory traversal:
   - Change `file=avatar.png` to `file=../../../../etc/.env`
   - Alternative encodings that might work:
     - `file=..%2f..%2f..%2f..%2fetc%2f.env` (URL encoded)
     - `file=..%252f..%252f..%252f..%252fetc%252f.env` (double URL encoded)

### Step 4: Extract JWT Secret

1. The LFI should return the contents of `/etc/.env`
2. Look for the `JWT_SECRET` value in the response
3. Example response:
   ```
   JWT_SECRET=supersecret_admin_signing_key
   ADMIN_ID=1
   ADMIN_EMAIL=admin@site.local
   ```

### Step 5: Forge Admin JWT

1. Use the extracted JWT secret to forge a new JWT token
2. The token should have:
   - `sub: "1"` (admin user ID)
   - `role: "admin"`
   - Valid signature using the extracted secret
   - Algorithm: HS256

3. Example JWT payload:
   ```json
   {
     "sub": "1",
     "email": "admin@site.local",
     "role": "admin",
     "iat": 1234567890,
     "exp": 1234654290
   }
   ```

### Step 6: Access Admin Panel

1. Replace your current JWT token with the forged admin token
2. Navigate to `/admin` endpoint
3. The admin panel will display the flag: `FLAG{student-dashboard-rooted}`

## Technical Details

### Vulnerability Analysis

The LFI vulnerability exists in `server/src/controllers/mediaController.ts`:

```typescript
// Naive validation that misses encoded traversal
if (fileName.includes('..') || fileName.includes('//')) {
  return res.status(400).json({ error: 'Invalid file name' });
}

// Construct file path - vulnerable to path traversal
const basePath = '/var/app/uploads';
const filePath = path.join(basePath, userIdStr, fileName);
```

**Issues:**
1. Only checks for literal `..` and `//` strings
2. Doesn't handle URL encoding (`%2f`, `%252f`)
3. No proper path normalization
4. No validation against the base directory

### JWT Implementation

The JWT secret is intentionally stored in `/etc/.env` to make it accessible via LFI:

```typescript
private getJWTSecret(): string {
  try {
    // Read JWT secret from /etc/.env
    const envPath = '/etc/.env';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const jwtSecretMatch = envContent.match(/JWT_SECRET=(.+)/);
    // ...
  }
}
```

### Admin Protection

The admin endpoint is protected by middleware that verifies:
1. Valid JWT token
2. `role: "admin"` in the token claims

## Tools for Solving

- **Burp Suite** or **OWASP ZAP**: For intercepting and modifying requests
- **JWT.io** or **jwt_tool**: For JWT manipulation
- **Browser Dev Tools**: For monitoring network requests

## Prevention

To prevent this vulnerability:

1. **Proper Path Validation**:
   ```typescript
   const resolvedPath = path.resolve(basePath, userIdStr, fileName);
   if (!resolvedPath.startsWith(path.resolve(basePath))) {
     throw new Error('Path traversal detected');
   }
   ```

2. **Input Sanitization**:
   - Decode URL encoding before validation
   - Use allowlists for file names
   - Implement proper file type validation

3. **Security Headers**:
   - Add security headers to prevent other attacks
   - Implement rate limiting

4. **JWT Security**:
   - Store secrets in secure environment variables
   - Use strong, random secrets
   - Implement proper secret rotation
