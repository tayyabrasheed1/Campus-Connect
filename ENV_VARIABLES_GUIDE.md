# Environment Variables Reference Guide

## Backend Environment Variables (backend/.env)

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | `development` | Environment mode: development, production |
| `PORT` | number | `5000` | Backend server port |
| `MONGO_URI` | string | `mongodb://127.0.0.1:27017/campus_connect` | MongoDB connection string |
| `JWT_SECRET` | string | (required) | Secret key for JWT token signing (minimum 32 chars) |
| `JWT_EXPIRES_IN` | string | `7d` | JWT token expiration time |
| `OTP_EXPIRY_MINUTES` | number | `10` | OTP code expiration time in minutes |
| `FRONTEND_URL` | string | `http://localhost:5173` | Frontend application URL (for CORS) |
| `ADMIN_EMAILS` | string | (empty) | Comma-separated admin email addresses |
| `STUDENT_DOMAINS` | string | `szabist-isb.edu.pk` | Comma-separated student email domains |
| `FACULTY_DOMAINS` | string | `faculty.szabist-isb.edu.pk` | Comma-separated faculty email domains |
| `ALUMNI_DOMAINS` | string | `alumni.szabist-isb.edu.pk` | Comma-separated alumni email domains |
| `FACULTY_EMAIL_HINTS` | string | `faculty,prof,lecturer,hod` | Keywords identifying faculty emails |
| `ALUMNI_EMAIL_HINTS` | string | `alumni,grad` | Keywords identifying alumni emails |

## Frontend Environment Variables (App Ui/.env)

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | `/api` | API endpoint path (relative or absolute) |
| `VITE_BACKEND_URL` | string | `http://localhost:5000` | Backend server URL for direct requests |

## Development vs Production

### Development Configuration
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect
JWT_SECRET=simple_dev_secret_for_testing
FRONTEND_URL=http://localhost:5173
```

### Production Configuration (Vercel)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_connect
JWT_SECRET=<strong-random-key-32+-chars>
FRONTEND_URL=https://your-domain.vercel.app
```

## Generating a Secure JWT_SECRET

### Option 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option 3: Online Generator
Visit: https://generate-random.org/encryption-key-generator

## Environment-Specific Examples

### Local Development (macOS/Linux)
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect
JWT_SECRET=local_dev_secret_key_minimum_32_chars_long
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
FRONTEND_URL=http://localhost:5173
ADMIN_EMAILS=dev@localhost
STUDENT_DOMAINS=test.edu.pk,university.edu.pk
FACULTY_DOMAINS=faculty.test.edu.pk,faculty.university.edu.pk
ALUMNI_DOMAINS=alumni.test.edu.pk,alumni.university.edu.pk
```

### Vercel Production
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://admin:SecurePassword123@cluster0.abc123.mongodb.net/campus_connect
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
FRONTEND_URL=https://campus-connect-main.vercel.app
ADMIN_EMAILS=admin@university.edu.pk,principal@university.edu.pk
STUDENT_DOMAINS=student.example.edu.pk,example.edu.pk
FACULTY_DOMAINS=faculty.example.edu.pk
ALUMNI_DOMAINS=alumni.example.edu.pk
FACULTY_EMAIL_HINTS=faculty,prof,dr,lecturer,hod,head
ALUMNI_EMAIL_HINTS=alumni,alum,grad,graduate
```

## MongoDB Connection String Formats

### Local MongoDB
```
mongodb://127.0.0.1:27017/campus_connect
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/campus_connect?retryWrites=true&w=majority
```

### MongoDB Atlas with Special Characters in Password
```
mongodb+srv://username:url%40encoded%21password@cluster0.abc123.mongodb.net/campus_connect
```

## Vercel Environment Variables Setup

1. Go to your Vercel Project Settings
2. Navigate to "Environment Variables"
3. Click "Add New"
4. Enter variable name and value
5. Select which environments: Production, Preview, Development
6. Click "Save"
7. Redeploy for changes to take effect

Example setup in Vercel:
- Production: Set all critical variables
- Preview: Set staging MongoDB URI
- Development: Can be skipped (uses local .env)

## Common Issues & Solutions

### Issue: JWT errors in production
**Solution**: JWT_SECRET must be 32+ characters, generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue: CORS errors from frontend
**Solution**: Ensure FRONTEND_URL matches your frontend domain exactly

### Issue: MongoDB connection timeout
**Solution**: Check MongoDB Atlas network whitelist includes Vercel IPs

### Issue: Email domain verification fails
**Solution**: Verify STUDENT_DOMAINS, FACULTY_DOMAINS spelling/formatting

## Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong, randomly generated JWT_SECRET (32+ characters)
3. ✅ Use MongoDB Atlas with strong passwords
4. ✅ Store environment variables in Vercel/hosting dashboard only
5. ✅ Rotate JWT_SECRET periodically
6. ✅ Whitelist specific IPs in MongoDB Atlas if possible
7. ✅ Use HTTPS for all communications
8. ✅ Validate and sanitize all email domains
9. ✅ Keep sensitive variables out of logs

## Testing Environment Variables

### Check if variables are loaded correctly
```bash
# In backend directory
node -e "const env = require('./src/config/env'); console.log(JSON.stringify(env, null, 2))"
```

### Check Node environment
```bash
node -e "console.log(process.env.NODE_ENV)"
```

## Updating Variables Without Redeployment

### Local Development
1. Update `.env` file
2. Restart the development server
3. Changes take effect immediately

### Vercel Production
1. Update variable in Vercel Dashboard
2. Trigger redeploy (or automatic redeploy on push)
3. Changes take effect after redeployment

---

**Last Updated**: April 28, 2026  
**Applies To**: Campus Connect v1.0.0+
