"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import Sidebar from "@/app/components/dashboard/sidebar";
import Chat from "@/app/components/chat";
import Lyrics from "./lyrics";

interface Song {
    id: string;
    title: string;
    audioUrl: string | null;
    createdAt: string;
}


interface SongClientProps {
    songId: string;
}

export default function SongClient({ songId }: SongClientProps) {
    const { user } = useUserContext();
    const [displayPage, setDisplayPage] = useState(1);
    const [song, setSong] = useState<Song | null>(null);

    useEffect(() => {
        fetchSong();
    }, [songId]);
    const fetchSong = async () => {
        try {
            const res = await fetch(`/api/songs?id=${songId}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setSong(data);
            }
        } catch (error) {
            console.error('Error fetching song:', error);
        } finally {
            //   setLoading(false);
        }
    };


    const sideBarItems = [
        {
            selected: displayPage === 1,
            label: 'Chat',
            onClick: () => setDisplayPage(1)
        },
        {
            selected: displayPage === 2,
            label: 'Lyrics/Notes',
            onClick: () => setDisplayPage(2)
        },
    ];

    return (
        <div className="h-[calc(100vh-3rem)] bg-background flex flex-col overflow-hidden">
            <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 gap-2">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{song?.title}</h1>
                    <p className="text-grey">Here's your song overview with separate chat, lyrics and chords.</p>
                </div>
                <div className="bg-background rounded-lg shadow-sm border border-grey p-6">

                    {song && (
                        <audio controls className="w-full">
                            <source src={`/api/songs/${song.audioUrl}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
                <Sidebar title="Options" items={sideBarItems} />
                {displayPage === 1 && songId && <Chat songId={songId} />}
                {displayPage === 2 && <Lyrics songId={songId} />}
            </div>
        </div>
    );
}
