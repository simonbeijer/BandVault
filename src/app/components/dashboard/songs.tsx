import { useEffect, useState } from "react";
import Link from 'next/link';
import Spinner from "../spinner";

interface Songs {
    id: string
    title: string
    audioUrl: string
    createdAt: string
}

const Songs = () => {

    const [songs, setSongs] = useState<Songs[] | null>(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSongs()
    }, [])

    const getSongs = async () => {
        try {
            const res = await fetch('/api/songs', { method: 'GET', credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                console.log(data)
                setSongs(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="w-full bg-background rounded-lg shadow-sm border border-grey p-6">
            <ul className={`flex flex-col gap-2`}>
                {loading ? <Spinner /> : !songs ? (
                    <div>No Songs</div>
                ) : (songs?.map((song) => (
                    <li key={song.id} className={`cursor-pointer bg-background rounded-lg shadow-sm border border-grey p-2 `}>
                        <Link href={`/song/${song.id}`}>
                            {song.title}
                        </Link>
                    </li>)                ))
                }

            </ul>

        </div>
    )
}

export default Songs;