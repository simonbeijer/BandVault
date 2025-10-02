import { useEffect, useState } from "react";

interface Songs {
    id: string
    title: string
    audioUrl: string
    createdAt: string
}

const Songs = () => {

    const [songs, setSongs] = useState<Songs[] | null>(null)
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
        }
    }
    return (
        <div className="w-full bg-background rounded-lg shadow-sm border border-grey p-6">
            <ul className={`flex flex-col gap-2`}>
                {!songs ? (
                    <div>No Songs</div>
                ) : (songs?.map((song) => (
                    <li key={song.id} className={`cursor-pointer bg-background rounded-lg shadow-sm border border-grey p-2 `}>
                        {song.title}
                    </li>)
                ))

                }

            </ul>

        </div>
    )
}

export default Songs;