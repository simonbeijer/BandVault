'use client';

import { useState, useEffect, useRef } from 'react';
import { devLog } from '@/lib/logger';
import Spinner from '../spinner';

interface Message {
    id: string;
    text: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface ChatProps {
    songId?: string;
}

export default function Chat({ songId }: ChatProps) {
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const shouldScrollRef = useRef(true);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            let URL = '/api/messages';

            if (songId) {
                URL = `/api/messages?songId=${songId}`;
            }

            try {
                const res = await fetch(URL, { 
                    method: 'GET', 
                    credentials: 'include' 
                });

                if (res.ok) {
                    const allMessages = await res.json();
                    devLog(allMessages);
                    setMessages(allMessages);
                } else {
                    const error = await res.json();
                    console.error('Failed to fetch:', error);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        
        // Poll for new messages every 5 seconds
        const interval = setInterval(() => {
            fetchMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, [songId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (shouldScrollRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) {
            return;
        }

        setSending(true);
        const messageText = newMessage.trim();
        setNewMessage(''); // Clear input immediately

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: messageText,
                    songId: songId
                })
            });

            if (res.ok) {
                const message = await res.json();
                setMessages(prev => [...prev, message]);
            } else {
                const error = await res.json();
                console.error('Failed to send:', error);
                // Restore message on error
                setNewMessage(messageText);
            }
        } catch (error) {
            devLog(error);
            console.error('Error sending message:', error);
            // Restore message on error
            setNewMessage(messageText);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="bg-background flex flex-col h-full rounded-lg border border-grey p-4 gap-4 text-foreground">
            {/* Messages container with fixed height and scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg border border-grey bg-background">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spinner />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-grey">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <div key={message.id} className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-medium text-sm text-primary">
                                        {message.user.name}
                                    </span>
                                    <span className="text-xs text-grey">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="mt-1 text-foreground break-words">{message.text}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input stays fixed at bottom */}
            <div className="flex gap-2 flex-shrink-0">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground border-grey disabled:opacity-50"
                />
                <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-2 border rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
}