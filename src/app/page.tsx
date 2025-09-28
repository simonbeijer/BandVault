import Link from "next/link";
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col gap-8 text-center">
        <div className="space-y-6">
          <div className="flex flex-col items-center">

          <Image
            src="/band-vault-icon.png"
            alt="image of a vault filled with music"
            width={200}
            height={200}
            />
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Band Vault
          </h1>
            </div>

          <p className="text-lg text-grey max-w-md">
            BandVault help you and you band to save and organize demo recordings. Each song gets its own space with notes, lyrics, and chat, making it easy to track ideas from practice to finished songs.
          </p>
          <Link href="login" className="inline-block bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}