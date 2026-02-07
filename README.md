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
