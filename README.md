# Aurora

A lightning prism management interface that helps you manage and control payment splits on the Lightning Network. Aurora provides tools for creating, managing, and monitoring lightning payment distributions through prisms.

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- A Phoenix node running locally or remotely

## Getting Started

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

Aurora uses PostgreSQL for data storage, running in Docker for easy setup and management.

### Starting the Database

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
