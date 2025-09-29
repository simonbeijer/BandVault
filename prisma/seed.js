const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const password = process.env.PASSWORD;
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Clear existing data in correct order (due to foreign keys)
  await prisma.message.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();
  await prisma.band.deleteMany();

  // Create a band first
  const band = await prisma.band.create({
    data: {
      name: "Default Band"
    }
  });

  // Now create users with the bandId
  await prisma.user.createMany({
    data: [
      { 
        name: 'Alice', 
        email: 'user@example.com', 
        password: passwordHash, 
        role: 'user',
        bandId: band.id 
      },
      { 
        name: 'Bob', 
        email: 'admin@example.com', 
        password: passwordHash, 
        role: 'admin',
        bandId: band.id 
      },
    ],
  });

  console.log('✅ Database seeded!');
  console.log(`📴 Band created: ${band.name} (${band.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });