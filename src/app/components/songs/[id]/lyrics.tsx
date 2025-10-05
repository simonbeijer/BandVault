"use client";

import { useState, useEffect } from "react";
import Spinner from "../../spinner";

interface LyricsProps {
    songId: string;
}

export default function Lyrics({ songId }: LyricsProps) {
    const [lyrics, setLyrics] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLyrics = async () => {
            setLoading(true);
            setError("");
            
            try {
                const res = await fetch(`/api/songs?id=${songId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setLyrics(data.lyrics || "");
                } else {
                    setError("Failed to load lyrics");
                }
            } catch (error) {
                console.error('Error fetching lyrics:', error);
                setError("Error loading lyrics");
            } finally {
                setLoading(false);
            }
        };

        fetchLyrics(); // ← Call it OUTSIDE the function definition!
    }, [songId]);

    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/songs?id=${songId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ lyrics })
            });

            if (res.ok) {
                setIsEditing(false);
            } else {
                setError("Failed to save lyrics");
            }
        } catch (error) {
            console.error('Error saving lyrics:', error);
            setError("Error saving lyrics");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-background rounded-lg border border-grey p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lyrics</h2>
                {!loading && (
                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="cursor-pointer bg-background rounded-lg shadow-sm border border-grey p-2 hover:bg-grey/10 transition-colors"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center min-h-[10rem]">
                    <Spinner />
                </div>
            ) : isEditing ? (
                <div>
                    <textarea
                        className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground border-grey resize-none"
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        placeholder="Enter lyrics here..."
                    />
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="cursor-pointer bg-primary text-white rounded-lg shadow-sm border border-grey px-4 py-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="cursor-pointer bg-background rounded-lg shadow-sm border border-grey px-4 py-2 hover:bg-grey/10"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="whitespace-pre-wrap p-4 rounded-lg border border-grey min-h-[10rem] bg-background">
                    {lyrics || (
                        <p className="text-grey italic">No lyrics yet. Click Edit to add lyrics.</p>
                    )}
                </div>
            )}
        </div>
    );
}