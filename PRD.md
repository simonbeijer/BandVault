🧾 BandVault – MVP PRD (Solo Use)
🎯 Purpose
Personal app to organize demo recordings with song-based rooms for chat, lyrics, and notes.

✅ Core Features
1. Auth
    * Single-user login (use existing auth in template)
2. Global Chat
    * One simple chat thread, always accessible
3. Song Vault (List View)
    * List of songs ordered by upload date (newest first)
    * Each song: title (required), date created
    * Click = open detailed view
4. Song Detail View
    * Per-song chat
    * Editable notes
    * Editable lyrics
    * Upload or link audio demo (e.g., Google Drive or file upload)

📁 Pages
Page	Path	Description
Login	/login	User login page
Dashboard	/dashboard	Shows global chat + song list
Song Detail	/song/[id]	Notes, lyrics, audio, and chat room

🗄️ Data Models (Prisma)
prisma
CopyEdit
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String
}

model Song {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
  audioUrl  String?  // File or link
  notes     String?
  lyrics    String?
  messages  Message[]
}

model Message {
  id        String   @id @default(uuid())
  songId    String?
  userId    String
  text      String
  createdAt DateTime @default(now())
}
Global chat = messages with songId = null

📦 Storage Strategy
* Audio files: postgressSQL
* Text/chat: Stored in PostgreSQL via Prisma

🔒 Deployment Targets
* Frontend: Vercel
* Database: NeonNo changes needed for MVP.
