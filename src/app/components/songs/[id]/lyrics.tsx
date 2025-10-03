
"use client";

import { useState, useEffect } from "react";

interface LyricsProps {
    songId: string;
}

export default function Lyrics({ songId }: LyricsProps) {
    const [lyrics, setLyrics] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchLyrics();
    }, [songId]);

    const fetchLyrics = async () => {
        try {
            const res = await fetch(`/api/songs?id=${songId}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setLyrics(data.lyrics || "");
            }
        } catch (error) {
            console.error('Error fetching lyrics:', error);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/songs?id=${songId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lyrics })
            });

            if (res.ok) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving lyrics:', error);
        }
    };

    return (
        <div className="bg-background rounded-lg border border-grey p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lyrics</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="cursor-pointer bg-background rounded-lg shadow-sm border border-grey p-2">
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>
            {isEditing ? (
                <div>
                    <textarea
                        className="w-full h-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground border-grey"
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                    />
                    <button onClick={handleSave} className="cursor-pointer bg-primary rounded-lg shadow-sm border border-grey p-2 mt-2">
                        Save
                    </button>
                </div>
            ) : (
                <p className="whitespace-pre-wrap p-4 space-y-4 rounded-lg border border-grey min-h-[10rem]">{lyrics}</p>
            )}
        </div>
    );
}
