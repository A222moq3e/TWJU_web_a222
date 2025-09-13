# CTF Solution Guide

## Challenge Overview

This is a Local File Inclusion (LFI) challenge that leads to JWT secret extraction and privilege escalation through the avatar upload system.

## Intended Solve Path

### Step 1: Register and Login

1. Register a new account or use the test account: `john.doe@student.local` / `student123`
2. Login to access the student dashboard

### Step 2: Discover the Avatar Upload Vulnerability

1. Navigate to the "Update Profile" page (`/update`)
2. Notice the avatar upload functionality
3. The system allows uploading any file type as an avatar, including sensitive files like `.env`

### Step 3: Exploit the Avatar System

The avatar system has a critical vulnerability that allows reading arbitrary files:

1. **Upload a sensitive file** (like `.env`) as your avatar:
   - Go to `/update` page
   - Select a `.env` file from your local system
   - Upload it as your avatar
   - The system will accept any file type

2. **Access the uploaded file** through the avatar endpoint:
   - The avatar is served at `/api/auth/me/avatar`
   - This endpoint reads the file from the uploads directory
   - It returns the file with the correct content type based on extension

### Step 4: Extract JWT Secret

1. After uploading the `.env` file as your avatar, visit `/api/auth/me/avatar`
2. The endpoint will return the contents of the `.env` file as text
3. Look for the `JWT_SECRET` value in the response
4. Example response:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/student_dashboard_ctf"
   JWT_SECRET="supersecret_admin_signing_key"
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

The LFI vulnerability exists in the avatar upload system in `server/src/controllers/authController.ts`:

```typescript
// getMyAvatar function - vulnerable to arbitrary file reading
export const getMyAvatar = async (req: Request, res: Response) => {
  const user = await userService.findUserById(userId);
  const avatarPath = path.join(process.cwd(), 'uploads', user.profile.avatar);
  
  // No validation of file type or content
  const ext = path.extname(user.profile.avatar).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.env') contentType = 'text/plain';
  
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(avatarPath).pipe(res);
};
```

**Issues:**
1. No file type validation during upload - accepts any file type
2. No content validation - allows uploading sensitive files
3. Direct file serving without sanitization
4. No access control on uploaded files
5. File names are stored directly in database without validation

### JWT Implementation

The JWT secret is read from the environment variable (from `.env` file):

```typescript
private getJwtSecret(): string {
  // Read JWT secret from environment variable (from .env file)
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  throw new Error('JWT_SECRET not found in environment variables');
}
```

The LFI target is the `.env` file itself, which contains the JWT secret and database configuration.

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

1. **File Type Validation**:
   ```typescript
   const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
   if (!allowedTypes.includes(file.mimetype)) {
     throw new Error('Invalid file type');
   }
   ```

2. **File Content Validation**:
   - Scan uploaded files for malicious content
   - Validate file headers match extension
   - Implement file size limits

3. **Secure File Storage**:
   - Store files outside web root
   - Use random filenames instead of user-provided names
   - Implement proper access controls

4. **Input Sanitization**:
   - Validate and sanitize all file names
   - Use allowlists for file extensions
   - Implement proper path validation

5. **Security Headers**:
   - Add security headers to prevent other attacks
   - Implement rate limiting on uploads

6. **JWT Security**:
   - Store secrets in secure environment variables
   - Use strong, random secrets
   - Implement proper secret rotation
