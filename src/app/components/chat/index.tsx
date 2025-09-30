import { devLog } from '@/lib/logger'
import { useState }from 'react'
export default function Chat() {
    const [newMessage, setNewMessage] = useState<string>('')

    const sendMessage = async () => {
        if(!newMessage) {
            return
        }

        try {
            const res= await fetch( '/api/auth/messages',{ method: 'POST',headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                text: newMessage,
                songId: null
            })})

            const message = res.json()

            console.log("!", res)
            console.log("!!!!", message)
            // if(res.ok) {
            // }
        } catch(error) {
            devLog(error)
        }



    }

    return (
        <div className="bg-background flex flex-col h-2/4 rounded-lg border border-grey p-6 gap-2 text-foreground">
            <p>hello</p>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg border border-grey">

            </div>
            <div className="flex gap-2 ">

            <input type="text" value={newMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground border-grey" />
            <button onClick={sendMessage} className="px-4 py-2 border rounded-lg bg-primary text-foreground">TEST</button>
            </div>
        </div>
    )
}