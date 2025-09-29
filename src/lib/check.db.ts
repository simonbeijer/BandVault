import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    const bands = await prisma.band.findMany();
    const users = await prisma.user.findMany({
      include: {
        band: true
      }
    });
    const songs = await prisma.song.findMany({
      include: {
        band: true
      }
    });
    const messages = await prisma.message.findMany({
      include: {
        user: true,
        band: true,
        song: true
      }
    });
    
    console.log(`📴 BANDS (${bands.length}):`);
    bands.forEach(band => {
      console.log(`  - ${band.name} (${band.id}) - Created: ${band.createdAt.toLocaleDateString()}`);
    });
    
    console.log(`\n👥 USERS (${users.length}):`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Band: ${user.band?.name} - Role: ${user.role}`);
    });
    
    console.log(`\n🎵 SONGS (${songs.length}):`);
    if (songs.length === 0) {
      console.log('  No songs yet');
    } else {
      songs.forEach(song => {
        console.log(`  - ${song.title} - Band: ${song.band?.name} - Created: ${song.createdAt.toLocaleDateString()}`);
      });
    }
    
    console.log(`\n💬 MESSAGES (${messages.length}):`);
    if (messages.length === 0) {
      console.log('  No messages yet');
    } else {
      messages.forEach(msg => {
        const chatType = msg.songId ? `Song: ${msg.song?.title}` : 'Global Chat';
        console.log(`  - ${msg.user?.name}: "${msg.text}" (${chatType}) - ${msg.createdAt.toLocaleDateString()}`);
      });
    }
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  checkDatabase();
}

export { checkDatabase };