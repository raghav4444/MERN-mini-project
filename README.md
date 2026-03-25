# MERN Mini Project - Setup and Run Guide

This guide explains everything needed to run this project from scratch, including environment setup, database connection, and startup commands.

## 1. Project Overview

This is a Node.js + Express + EJS + MongoDB app with:
- User registration and login
- JWT cookie-based auth
- Profile page with posts
- Like/unlike and edit post flows

## 2. Prerequisites

Install the following tools first:

1. Node.js (recommended: LTS, version 20 or later)
2. npm (comes with Node.js)
3. MongoDB Community Server (local database)
4. Optional but useful:
- MongoDB Compass (GUI to inspect database)
- Nodemon (auto-restart server on file changes)

### Check your installed versions

Run these commands in PowerShell:

```powershell
node -v
npm -v
mongod --version
```

If any command fails, install that tool before continuing.

## 3. Open the Project

If you already have the folder, open it in VS Code.

Otherwise clone/copy the project and open terminal in:

```text
D:\MERN-mini-project
```

## 4. Install Dependencies

Run:

```powershell
npm install
```

This installs all required packages from `package.json`:
- express
- ejs
- mongoose
- bcrypt
- jsonwebtoken
- cookie-parser

## 5. Database Connection Details

MongoDB connection is currently hardcoded in `models/user.js`:

```js
mongoose.connect('mongodb://localhost:27017/mern-mini-project');
```

That means:
- MongoDB must be running on your machine (`localhost`)
- Default port is `27017`
- Database name used by this app is `mern-mini-project`

No `.env` file is used in current code.

## 6. Start MongoDB Locally

You must start MongoDB before starting the app.

### Option A: MongoDB as Windows service

If installed as a service:

```powershell
net start MongoDB
```

### Option B: Start manually with `mongod`

If service is not configured, run:

```powershell
mongod
```

Keep this terminal open while the app is running.

### Verify DB is reachable (optional)

In another terminal:

```powershell
mongosh
```

Then run:

```javascript
show dbs
use mern-mini-project
```

## 7. Run the App

This project does not currently define a `start` script in `package.json`, so use one of these commands:

### Run with Node

```powershell
node app.js
```

### Run with Nodemon (recommended in development)

```powershell
npx nodemon app.js
```

Server should start on:

```text
http://localhost:3000
```

## 8. First-Time Functional Check

1. Open `http://localhost:3000`
2. Create an account from the index page form
3. Go to `/login` and sign in
4. After login you should reach `/profile`
5. Create a post, like/unlike, and edit it

If these steps work, app + DB connection are working correctly.

## 9. Common Issues and Fixes

### Issue: `npx nodemon app.js` exits with code 1

Possible causes:
1. MongoDB is not running
2. Port `3000` is already in use
3. Dependency install failed or `node_modules` is missing

Fix steps:
1. Ensure MongoDB is running (`net start MongoDB` or `mongod`)
2. Reinstall packages:

```powershell
npm install
```

3. Retry:

```powershell
npx nodemon app.js
```

### Issue: Cannot connect to MongoDB

Check:
1. `mongod` process/service is running
2. Connection URL matches installed MongoDB host/port
3. No firewall or custom MongoDB config blocking `27017`

### Issue: App runs but login fails

Check:
1. A user was created via `/create`
2. Same email/password are being used
3. Browser accepts cookies (JWT token is stored in cookie)

## 10. Useful File Map

- `app.js`: Express app, routes, auth middleware, server startup
- `models/user.js`: Mongoose user schema + DB connection
- `models/post.js`: Mongoose post schema
- `views/*.ejs`: UI templates
- `public/stylesheets/style.css`: app styles

## 11. (Recommended) Improvement for Production

Current code uses:
- Hardcoded JWT secret (`"shhshshshhshsh"`)
- Hardcoded MongoDB URL

For production, move these to environment variables and use a `.env` setup.

