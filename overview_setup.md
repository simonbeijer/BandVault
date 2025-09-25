# Template Setup Guide
## Transform This Template Into Your Branded Project

---

## 🎯 **Template Overview**

### What This Template Provides
This is a **production-ready Next.js 15 TypeScript full-stack template** designed to give you a complete foundation for modern web applications. It's not just a basic starter - it's a comprehensive boilerplate with enterprise-level features already implemented.

### Technology Stack
- **Next.js 15.3.3** - Latest React framework with App Router
- **TypeScript 5.6.0** - Full type safety throughout the application
- **React 19.1.0** - Latest React with server components
- **PostgreSQL + Prisma 6.9.0** - Production database with type-safe ORM
- **JWT Authentication** - Complete login/logout system with secure token handling
- **Tailwind CSS 4.1.10** - Latest utility-first CSS framework
- **Zod 3.25.76** - Runtime validation with TypeScript integration
- **Docker** - Containerized development environment
- **Testing Suite** - Jest (unit) + Cypress (e2e) ready-to-use

### Security Features (Already Implemented)
- ✅ **Input validation and sanitization** on all endpoints with Zod schemas
- ✅ **Rate limiting** on authentication endpoints  
- ✅ **Comprehensive security headers** (CSP, HSTS, XSS protection)
- ✅ **Secure JWT handling** with HttpOnly cookies
- ✅ **Password hashing** with bcrypt
- ✅ **Security event logging** for monitoring
- ✅ **Route protection** with middleware
- ✅ **Type-safe API endpoints** preventing runtime errors

### What's Ready to Use vs Template Placeholders
**✅ Fully Functional:**
- Complete authentication system (login/logout)
- Protected dashboard with user context
- Type-safe database models and API endpoints
- Security middleware and validation with Zod schemas
- UI component library with TypeScript
- Docker development environment
- Testing infrastructure with TypeScript support

**⚠️ Template Placeholders (Need Customization):**
- Generic project names throughout codebase
- Generic branding and metadata
- Default database credentials in docker-compose
- Placeholder content in dashboard
- `❗ CHANGE THIS` comments throughout codebase

---

## 🔧 **USER RESPONSIBILITIES** 
### Tasks You Must Handle (AI Assistants Cannot Do These)

**⚠️ CRITICAL: These require manual setup and cannot be automated:**

### 📦 **Dependency Installation**
Install all required packages:
```bash
npm install
```

### 📝 **Environment Variables** 
Create a `.env` file in your project root:
```bash
DATABASE_URL="postgresql://simon:S1m0n@postgres:5432/yourprojectdb"
JWT_SECRET="your-secure-random-jwt-secret-32-characters-or-more"
```
- Keep this file private - never commit to version control
- Make JWT_SECRET long and random for security

### 🐳 **Docker Operations**
Start your database container:
```bash
docker compose up -d postgres
```

### 🗄️ **Database Setup**
Initialize your database schema:
```bash
npm run prisma:generate
npx prisma migrate dev --name init
npm run seed  # (optional - adds sample data)
```

### 🚀 **Start Application**
Launch your development server:
```bash
docker compose up your-project-name
```

**Note:** The setup order in the Complete Setup Workflow section below is critical - follow those steps exactly.

---

## 🎨 **Template-to-Project Customization**
### Transform Generic Template Into Your Branded Project

### Step 1: Project Identity Changes
**Files to Update for Branding:**

1. **📦 package.json** 
   ```json
   {
     "name": "your-project-name"  // Change from "basic-setup-next-typescript" ✅
   }
   ```

2. **📖 README.md** 
   - Replace title with your project name ✅
   - Update description with your project details ✅
   - Remove template-specific content

3. **🌐 src/app/layout.tsx**
   ```typescript
   export const metadata: Metadata = {
     title: "Your Project Name",        // Change from template placeholder ✅
     description: "Your project description"  // Update description ✅
   };
   ```

4. **🐳 docker-compose.yml**
   ```yaml
   services:
     your-project-name:                      # Change service name from "your-project-name" ✅
       container_name: your-project-app      # Change from "your-project-app" ✅
       environment:
         - DATABASE_URL=postgresql://simon:S1m0n@postgres:5432/yourprojectdb ✅
     postgres:
       container_name: your-project-postgres  # Change from "your-project-postgres" ✅
       environment:
         POSTGRES_DB: yourprojectdb           # Change from "yourprojectdb" ✅
   ```

### Step 2: Clean Up Template Markers
- **Remove all `❗ CHANGE THIS` comments** throughout the codebase
- These comments mark every place that needs customization

### Step 3: Customize Placeholder Data
**Files to Review:**

1. **Dashboard Content**
   - Check `src/app/(auth)/dashboard/page.tsx` for template-specific content
   - Update any placeholder text or data

2. **Type Definitions**
   - Review `src/types/` directory for any template-specific types
   - Update interface names and properties as needed

3. **Component Branding**
   - Review UI components for any "Template" references
   - Update footer, header, or navigation elements

---

## 🚀 **SETUP INSTRUCTIONS - FOLLOW EXACTLY IN THIS ORDER**

### 🚨 **STOP! READ THIS FIRST**
**The order of these steps is CRITICAL. Doing them out of order will cause errors.**

**Template customization MUST happen BEFORE starting Docker containers.**

---

## **PHASE 1: PREPARATION**

### ✅ **Step 1: Check Prerequisites**
Make sure you have installed:
- Node.js v18 or higher
- Docker and Docker Compose 
- npm

### ✅ **Step 2: Install Dependencies**
**Run this command first:**
```bash
npm install
```

---

## **PHASE 2: CUSTOMIZE TEMPLATE (BEFORE DOCKER!)**

### ✅ **Step 3: ⚠️ CRITICAL - Update Docker Configuration**
**MUST DO BEFORE starting any containers!**

Open `docker-compose.yml` and change these template names to YOUR project names:

**Find this section and update it:**
```yaml
services:
  your-project-name:                     # ← Change service name from template placeholder
    container_name: your-project-app     # ← Change "your-project-app" to your project
    environment:
      - DATABASE_URL=postgresql://simon:S1m0n@postgres:5432/yourprojectdb

  postgres:
    container_name: your-project-postgres  # ← Change "your-project-postgres" 
    environment:
      POSTGRES_DB: yourprojectdb           # ← Change "yourprojectdb"
```

**Example:** If your project is called "taskmanager", use:
- Service name: `taskmanager:` (instead of `your-project-name:`)
- `container_name: taskmanager-app`
- `container_name: taskmanager-postgres` 
- `POSTGRES_DB: taskmanagerdb`
- Database URL: `postgresql://simon:S1m0n@postgres:5432/taskmanagerdb`

### ✅ **Step 4: Create Environment File**
Create a new file called `.env` in your project root folder.

**The database name MUST match what you put in docker-compose.yml above:**
```env
DATABASE_URL="postgresql://simon:S1m0n@postgres:5432/yourprojectdb"
JWT_SECRET="your-secure-random-jwt-secret-32-characters-or-more"
```

**Make sure:**
- Replace `yourprojectdb` with the EXACT same database name from Step 3
- Create a long, random JWT_SECRET (32+ characters)

---

## **PHASE 3: START SERVICES**

### ✅ **Step 5: Start Database**
**Now you can start Docker (after customization above):**
```bash
docker compose up -d postgres
```

### ✅ **Step 6: Start Next.js App Container**
**Start the Next.js container (this will also ensure postgres is running):**
```bash
docker compose up -d your-project-name
```
Replace `your-project-name` with your service name from docker-compose.yml.

### ✅ **Step 7: Initialize Database**
**🚨 IMPORTANT: Run these commands FROM INSIDE the Docker container:**
```bash
docker compose exec your-project-name npm run prisma:generate
docker compose exec your-project-name npx prisma migrate dev --name init
docker compose exec your-project-name npm run seed
```

**Why run from inside Docker?**
Your .env file uses `postgres:5432` as the database host. This hostname only works inside Docker containers. Running Prisma commands from your local terminal will fail because your computer doesn't know what "postgres" means - it only works inside the Docker network.

---

## **PHASE 4: CUSTOMIZE BRANDING**

### ✅ **Step 8: Update Project Files**
Change these files to use your project name:

1. **package.json** - Change `"name": "basic-setup-next-typescript"` to `"name": "your-project-name"`
2. **README.md** - Update title and description 
3. **src/app/layout.tsx** - Update the metadata title and description
4. **src/app/page.tsx** - Update welcome message and project references
5. **Remove all `❗ CHANGE THIS` comments** from the codebase

---

## **PHASE 5: VERIFY TYPESCRIPT SETUP**

### ✅ **Step 9: Verify TypeScript Compilation**
**Ensure everything compiles correctly:**
```bash
docker compose exec your-project-name npm run build
```
This will check for TypeScript errors and build the production bundle.

**If you see TypeScript errors:**
- Fix any type issues in your customized files
- Ensure all imports have correct file extensions
- Check that your custom types are properly defined

---

## **PHASE 6: LAUNCH**

### ✅ **Step 10: Start Your Application**
```bash
docker compose up your-project-name
```
(Replace `your-project-name` with the service name you set in docker-compose.yml)

### ✅ **Step 11: Test Everything Works**
Go to `http://localhost:3000` and verify:
- [ ] Home page shows your project name (not "Your Project")
- [ ] Login page works
- [ ] Can create and login with test user  
- [ ] Dashboard displays correctly
- [ ] No template placeholder text visible
- [ ] TypeScript compilation succeeds with `npm run build`

---

## 🎯 **QUICK REFERENCE - Do These Steps In Order:**
1. Check prerequisites (Node.js v18+, Docker)
2. `npm install`
3. **⚠️ CRITICAL: Update docker-compose.yml names**
4. Create `.env` with matching database name
5. `docker compose up -d postgres` 
6. Run Prisma commands inside Docker
7. Update branding files
8. **Verify TypeScript compilation**
9. `docker compose up your-project-name`
10. Test at localhost:3000

---

## 🚨 **Troubleshooting Common Issues**

### TypeScript Compilation Errors
- **Problem**: Build fails with type errors after customization
- **Solution**: Check that all custom types are properly defined in `src/types/` and imports use correct file extensions (.tsx/.ts)

### Database Connection Issues
- **Problem**: `Can't reach database server at postgres:5432`
- **Solution**: You're running Prisma commands from your local terminal, but the database hostname `postgres` only works inside Docker containers. Run commands from inside Docker:
  ```bash
  docker compose exec your-project-name npx prisma migrate dev
  ```

- **Problem**: `ECONNREFUSED` errors  
- **Solution**: Ensure PostgreSQL container is running with `docker compose up -d postgres`

### Database Name Mismatch Errors
- **Problem**: Database connection fails or wrong database created
- **Solution**: Ensure the database name in docker-compose.yml matches the one in your .env file

### Environment Variable Errors  
- **Problem**: JWT or database errors
- **Solution**: Verify `.env` file exists with correct `DATABASE_URL` and `JWT_SECRET`

### Port Conflicts
- **Problem**: Port 3000 or 5432 already in use
- **Solution**: Update ports in `docker-compose.yml` or stop conflicting services

### Prisma Issues
- **Problem**: Database schema out of sync
- **Solution**: Run `npx prisma migrate reset` and `npx prisma migrate dev`

---

## 📝 **Development Workflow Commands**
### Commands YOU Will Use Regularly

```bash
# Development (Docker handles these)
docker compose up your-project-name  # Start development server (replace with your service name)
docker compose up                    # Start all services

# Database  
npm run prisma:generate    # Update Prisma client
npx prisma migrate dev     # Apply database migrations
npx prisma studio         # View database in browser
npm run seed              # Add sample data

# TypeScript & Building
npm run build             # Build production bundle and check types
npm run lint              # Check code quality and TypeScript errors

# Testing
npm test                  # Run unit tests
npm run test:e2e         # Run Cypress end-to-end tests

# Code Quality
npm run prettier:format   # Format code style
```

---

## ⚡ **What Makes This TypeScript Template Special**

### Production-Ready Features
- **Full TypeScript integration** with strict type checking
- **Type-safe database** operations with Prisma
- **Zod validation schemas** for runtime type safety
- **Security-first architecture** with rate limiting, input validation, and secure headers
- **Modern Next.js 15** with App Router and server components
- **Comprehensive testing** setup with TypeScript support
- **Docker development** environment for consistency
- **Vercel deployment** configuration included

### TypeScript-Specific Benefits  
- **Compile-time error detection** prevents runtime issues
- **Excellent IDE support** with autocomplete and refactoring
- **Type-safe API routes** with proper request/response typing
- **Runtime validation** with Zod that matches TypeScript types
- **Better maintainability** with explicit interfaces and types

### Time-Saving Benefits  
- **Skip 2-3 weeks** of boilerplate setup
- **Enterprise-level security** already implemented
- **Best practices** baked into the architecture
- **Modern tooling** configured and ready
- **Testing infrastructure** established
- **Full type safety** configured throughout

### Perfect Starting Point For:
- SaaS applications
- Dashboard applications  
- E-commerce platforms
- Content management systems
- AI-powered applications
- Any app requiring user authentication and type safety

---

## 🎯 **Next Steps After Setup**

Once you've completed the setup and customization:

1. **Add Your Features**
   - Build on the existing authentication system
   - Add your business logic to the dashboard
   - Create new protected routes as needed
   - Define custom types in `src/types/`

2. **Leverage TypeScript Features**  
   - Add custom validation schemas in `src/lib/api/schemas.ts`
   - Create type-safe API endpoints following existing patterns
   - Use the type system to prevent bugs at compile time

3. **Customize Styling**  
   - Modify the Tailwind CSS theme in `globals.css`
   - Update component styles to match your brand
   - Add custom Tailwind components

4. **Deploy to Production**
   - Template is Vercel-ready with TypeScript support
   - Update environment variables for production
   - Configure your production database
   - Run `npm run build` to verify production readiness

5. **Scale and Extend**
   - Add more API endpoints following existing TypeScript patterns
   - Implement user roles and permissions with proper typing
   - Add email notifications or other integrations
   - Expand the type definitions as your app grows

---

**This TypeScript template gives you a production-ready foundation with full type safety. Focus on building your unique features instead of basic infrastructure!**