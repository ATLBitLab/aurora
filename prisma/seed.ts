import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.contact.deleteMany();

  // Create sample contacts
  const contacts = [
    {
      firstName: 'Satoshi',
      lastName: 'Nakamoto',
      screenName: 'satoshi',
      email: 'satoshi@bitcoin.org',
      metadata: {
        telegram: '@satoshi',
        twitter: '@satoshi',
        bio: 'Bitcoin creator',
        interests: ['cryptography', 'distributed systems', 'economics']
      }
    },
    {
      firstName: 'Alice',
      lastName: 'Lightning',
      screenName: 'alicezap',
      nostrPubkey: '7177772c4187bee24bd427b496fab4f3b134dc1d772d5e96566e063e825ae524',
      metadata: {
        telegram: '@alicezap',
        twitter: '@alicezap',
        bio: 'Lightning Network enthusiast',
        interests: ['lightning', 'bitcoin', 'programming'],
        preferredPaymentMethod: 'lightning'
      }
    },
    {
      firstName: 'Bob',
      lastName: 'Builder',
      screenName: 'bitcoinbob',
      email: 'bob@builder.btc',
      nostrPubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      metadata: {
        github: 'bitcoinbob',
        skills: ['rust', 'c++', 'bitcoin core'],
        bio: 'Bitcoin Core contributor'
      }
    },
    {
      firstName: 'Carol',
      lastName: 'Crypto',
      screenName: 'carolcrypto',
      metadata: {
        matrix: '@carol:matrix.org',
        interests: ['privacy', 'encryption', 'self-sovereignty'],
        languages: ['English', 'Python', 'Rust'],
        bio: 'Privacy advocate and developer'
      }
    },
    {
      firstName: 'Dave',
      lastName: 'Decentralized',
      screenName: 'daveweb5',
      email: 'dave@web5.dev',
      metadata: {
        discord: 'dave#1234',
        projects: ['decentralized identity', 'web5', 'nostr'],
        bio: 'Building the decentralized web',
        skills: ['typescript', 'rust', 'distributed systems']
      }
    }
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact
    });
  }

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 