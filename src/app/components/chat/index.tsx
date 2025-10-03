'use client';

import { useState, useEffect, useRef } from 'react';
import { devLog } from '@/lib/logger'

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
    songId?: string
}
export default function Chat({ songId }: ChatProps) {
    const [newMessage, setNewMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => {
            fetchMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, [])



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages])



    const fetchMessages = async () => {
        let URL = '/api/messages'

        if(songId) {
            URL = `/api/messages?songId=${songId}`
        }

        try {

            const res = await fetch(URL, { method: 'GET', credentials: 'include' })

            if (res.ok) {

                const allMessages = await res.json();
                devLog(allMessages)
                setMessages(allMessages)
            } else {

                const error = await res.json();
                console.error('Failed to send:', error);
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) {
            return
        }

        try {
            const res = await fetch('/api/messages', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    text: newMessage.trim(),
                    songId: songId
                })
            })

            const message = await res.json()
            setNewMessage('')
            setMessages([...messages, message])
        } catch (error) {
            devLog(error)
        }



    }

    return (
        <div className="bg-background flex flex-col h-2/4 rounded-lg border border-grey p-6 gap-2 text-foreground">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg border border-grey">
                {loading ? (
                    <Spinner />
                ) : messages.length === 0 ? (
                    <div>
                        <p>NO messages</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="font-medium text-sm">{message.user.name}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className=" mt-1">{message.text}</p>

                        </div>
                    )
                    )
                )}
                <div ref={messagesEndRef} className="h-1" />
            </div>
            <div className="flex gap-2 ">

                <input type="text" value={newMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground border-grey" />
                <button onClick={sendMessage} className="px-4 py-2 border rounded-lg bg-primary text-foreground">TEST</button>
            </div>
        </div>
    )
}