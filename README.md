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
- A Phoenix node running locally or remotely
- Docker and Docker Compose (only needed for local database setup)

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

## Database Setup

Aurora uses PostgreSQL for data storage. You have two options:

### Option 1: Staging Database (Recommended for Frontend Developers)

Use the hosted Supabase database - no Docker required! This is the recommended option for frontend developers who want to focus on UI/UX without worrying about backend setup.

1. **Get the connection string:**
   - Contact your team lead for the Supabase database connection string
   - Or access it from the Supabase dashboard: Settings → Database → Connection string (use the "URI" format)

2. **Set up your environment:**
   ```bash
   # Create a .env file in the project root
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require"
   PHOENIXD_HOST=localhost
   PHOENIXD_HTTP_PASS_LIMITED=abc123
   ```

3. **Sync the database schema:**
   ```bash
   # This applies existing migrations to the staging database
   npx prisma migrate deploy
   ```

4. **Load sample data (optional):**
   ```bash
   npx prisma db seed
   ```

That's it! You're ready to develop. The staging database is shared, so you'll see data from other developers.

### Option 2: Local Database (For Self-Hosting)

Run PostgreSQL in Docker on your local machine. Use this option if you want a completely isolated database or are self-hosting the project.

1. **Start the PostgreSQL container:**
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

2. **Set up your environment:**
   ```bash
   # Create a .env file in the project root
   DATABASE_URL="postgresql://aurora:aurora_dev_password@localhost:5432/aurora_db"
   PHOENIXD_HOST=localhost
   PHOENIXD_HTTP_PASS_LIMITED=abc123
   ```

3. **Apply database migrations:**
   ```bash
   npx prisma migrate dev
   ```

### Loading Sample Data

The project includes seed data to help you get started quickly. The seed data includes 5 sample contacts with various fields and metadata:

**For Staging Database:**
```bash
npx prisma db seed
```

**For Local Database:**
```bash
npx prisma db seed
```

This will create sample contacts including:
- Satoshi Nakamoto (with social media and interests)
- Alice Lightning (with Nostr integration)
- Bob Builder (developer profile)
- Carol Crypto (privacy advocate)
- Dave Decentralized (web5 developer)

**Note:** On the staging database, seed data is shared. If you want to reset and reload seed data on your local database:
```bash
# Reset the local database
npx prisma migrate reset

# Or manually:
npx prisma db push --force-reset
npx prisma db seed
```

### Managing the Database

**For Local Database (Docker):**

```bash
# View database logs
docker compose logs postgres

# Stop the database
docker compose down

# Stop the database and remove volume (CAUTION: This will delete all data)
docker compose down -v

# Access PostgreSQL CLI
docker compose exec postgres psql -U aurora -d aurora_db
```

**For Both Options:**

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration after schema changes (local only)
npx prisma migrate dev --name <migration_name>

# Apply migrations to staging database
npx prisma migrate deploy
```

### Database Structure

The database currently includes:

- `contacts` table:
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

- `PHOENIXD_HOST`: Phoenix node host address
- `PHOENIXD_HTTP_PASS_LIMITED`: Phoenix node limited access password
- `DATABASE_URL`: PostgreSQL connection string

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Add your license here]
