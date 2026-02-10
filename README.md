# Aurora

A lightning prism management interface that helps you manage and control payment splits on the Lightning Network. Aurora provides tools for creating, managing, and monitoring lightning payment distributions through prisms.

![Aurora Dashboard](public/aurora-poster.jpg)

## WIP - deep alpha yall - do not use (yet)

This is a work in progress. Things are rapidly being built and changed on various branches. Design and UX planning is happening in these docs:

- [Deeksha's Aurora User Journeys](https://www.figma.com/board/DN6CM2jcfiJiANeT2hw55C/Aurora-User-Journeys?node-id=0-1&t=9kwHem1iznqMuHVH-1)
- [Deeksha's Wireframes](https://www.figma.com/design/YzJPVZ8VHcm3BWcqvdwGaH/Prism-project?node-id=0-1&t=dRecM7IKxuVvOujL-1)
- [Deeksha's UI Designs and Prototype](https://www.figma.com/design/eTUcSLVwAKhRIQxMqBqo8v/Aurora---Prism-Project?node-id=2335-4864&t=OYX3l2yehRQtYU6o-1)

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- A Phoenix node running locally or remotely

1. Clone the repository:
```bash
git clone https://github.com/ATLBitLab/aurora.git
cd aurora
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
# Copy the example env file and modify as needed
cp .env.example .env
```

## Authentication Setup

Aurora uses [Better Auth](https://www.better-auth.com/) for authentication with email/password login.

### Required Configuration

1. **Generate a secret key** for Better Auth:
```bash
openssl rand -base64 32
```

2. **Update your `.env` file** with the following variables:
```bash
# Better Auth Configuration (REQUIRED)
BETTER_AUTH_SECRET=your-generated-secret-key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Trusted origins (include your production URL when deploying)
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
```

### Email Whitelist (Optional)

To restrict who can create accounts, set the `ALLOWED_EMAILS` environment variable with a comma-separated list of allowed email addresses:

```bash
# Only these emails can create accounts
ALLOWED_EMAILS=admin@example.com,team@example.com,developer@example.com
```

If this variable is not set or is empty, any email address can register.

### Creating Your First User

1. Start the application
2. Click "Sign In" on the homepage
3. Click "Sign up" to create a new account
4. Enter your email, password (min 8 characters), and name
5. You'll be automatically signed in after registration

## Database Setup

Aurora uses PostgreSQL for data storage, running in Docker for easy setup and management.


If you are only working on the frontned UI, you can use a staging database on Supabase. In your `.env`, add this:

```
DATABASE_URL="postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

Replace `PROJECT_ID` and `PASSWORD` with the proper credentials.


### Starting the Database (Devs Only)

1. Start the PostgreSQL container:
```bash
docker compose up -d
```

This will:
- Create a PostgreSQL 15 instance
- Set up a persistent volume for data storage
- Expose the database on port 5432
- Configure the following credentials:
  - User: aurora
  - Password: aurora_dev_password
  - Database: aurora_db

2. Apply database migrations:
```bash
npx prisma migrate dev
```

### Loading Sample Data

The project includes seed data to help you get started quickly. The seed data includes 5 sample contacts with various fields and metadata:

1. Load the seed data:
```bash
npx prisma db seed
```

This will create sample contacts including:
- Satoshi Nakamoto (with social media and interests)
- Alice Lightning (with Nostr integration)
- Bob Builder (developer profile)
- Carol Crypto (privacy advocate)
- Dave Decentralized (web5 developer)

To reset the database and reload seed data:
```bash
# Reset the database
npx prisma migrate reset

# Or manually:
npx prisma db push --force-reset
npx prisma db seed
```

### Managing the Database

Common database management commands:

```bash
# View database logs
docker compose logs postgres

# Stop the database
docker compose down

# Stop the database and remove volume (CAUTION: This will delete all data)
docker compose down -v

# Access PostgreSQL CLI
docker compose exec postgres psql -U aurora -d aurora_db

# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration after schema changes
npx prisma migrate dev --name <migration_name>
```

### Database Structure

The database includes:

- **User/Session/Account tables**: For Better Auth authentication
- **contacts table**:
  - UUID-based IDs
  - Optional fields for basic info (firstName, lastName, etc.)
  - Nostr integration (pubkey storage)
  - Flexible JSON metadata field for extensibility
  - Optimized indexes for common queries

Example contact structure:
```typescript
{
  id: "uuid",
  firstName: "Alice",
  lastName: "Lightning",
  screenName: "alicezap",
  nostrPubkey: "npub...",
  email: "alice@lightning.btc",
  metadata: {
    telegram: "@alicezap",
    interests: ["lightning", "bitcoin"],
    preferredPaymentMethod: "lightning"
  }
}
```

## Development

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

## Windows Troubleshooting

If you're developing on Windows and experiencing issues with the database connection or environment variables not being picked up, try these solutions:

### 1. Line Ending Issues in `.env`

Windows may create `.env` files with CRLF line endings, which can cause issues with environment variable parsing.

**Fix:** Convert your `.env` file to LF line endings:

```powershell
# In PowerShell, recreate the .env file with proper line endings
$content = Get-Content .env.example -Raw
$content = $content -replace "`r`n", "`n"
$content | Set-Content .env -NoNewline
# Then edit .env with your values
```

Or use VS Code: Open `.env`, click "CRLF" in the bottom-right status bar, and select "LF".

### 2. Prisma Not Picking Up DATABASE_URL

If Prisma can't connect to the database even though your `.env` is correct:

**Option A:** Load environment variables explicitly before running Prisma:

```powershell
# PowerShell
$env:DATABASE_URL = "your-database-url-here"
npx prisma migrate dev
```

```cmd
:: Command Prompt
set DATABASE_URL=your-database-url-here
npx prisma migrate dev
```

**Option B:** Use `dotenv-cli` to ensure `.env` is loaded:

```bash
npx dotenv -e .env -- npx prisma migrate dev
```

### 3. Docker Networking Issues (WSL2)

If you're using Docker Desktop with WSL2 and can't connect to the PostgreSQL container:

**Fix:** Use `host.docker.internal` instead of `localhost` in your connection string:

```bash
# In .env, try this instead of localhost
DATABASE_URL="postgresql://aurora:aurora_dev_password@host.docker.internal:5432/aurora_db"
```

Or ensure your PostgreSQL container is exposing the port correctly:

```powershell
# Check if the port is accessible
Test-NetConnection -ComputerName localhost -Port 5432
```

### 4. Using the Staging Database (Recommended for Frontend Work)

If you're only working on the frontend UI, use the staging Supabase database to avoid local setup issues entirely:

```bash
DATABASE_URL="postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

Ask a maintainer for the staging credentials.

### 5. Generating a Secret on Windows

The `openssl` command may not be available on Windows. Alternatives:

```powershell
# PowerShell - generate a random base64 string
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Or use an online generator like [generate-secret.vercel.app](https://generate-secret.vercel.app/32).

### 6. General Tips for Windows Developers

- **Use Git Bash or WSL** for a more consistent experience with bash commands
- **Run PowerShell as Administrator** if you encounter permission issues
- **Check your Node.js version**: `node --version` (should be v18+)
- **Restart your terminal** after modifying `.env` files

If you continue to have issues, reach out in the ATL BitLab Discord!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth (generate with `openssl rand -base64 32`) | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL for auth callbacks | Yes |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated list of trusted origins | Yes |
| `PHOENIXD_HOST` | Phoenix node host address | Yes |
| `PHOENIXD_HTTP_PASS_LIMITED` | Phoenix node limited access password | Yes |
| `ALLOWED_EMAILS` | Comma-separated list of allowed email addresses (optional) | No |

## Deploying to Vercel

The build uses `yarn run vercel-build` (see `vercel.json`), which runs `prisma generate` then `yarn build`. **Do not** use `prisma migrate dev` in the Vercel build—it requires a live DB and fails on preview/production.

- If the Vercel dashboard has a custom **Build Command**, set it to `yarn run vercel-build` or clear it so `vercel.json` is used.
- Run migrations against your production DB separately (e.g. `prisma migrate deploy` in a one-off job or CI step with `DATABASE_URL` set).

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Add your license here]
