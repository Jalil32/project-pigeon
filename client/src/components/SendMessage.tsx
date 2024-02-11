import { KeyboardEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'
import { useParams } from 'react-router-dom'

interface Message {
    sentFrom: string
    content: string
    timestamp: number
    recipient: string[] // Assuming recipient should be an array based on server-side code
    groupId: string
}

interface SendMessageProps {
    onSendMessage: any
    group: any // Consider defining a more specific type for group
    setIsTyping: Dispatch<SetStateAction<boolean>>
    setTypingName: Dispatch<SetStateAction<string>>
}

export function SendMessage({ onSendMessage, group, setIsTyping, setTypingName }: SendMessageProps) {
    const [message, setMessage] = useState('')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const currentUserID = JSON.parse(localStorage.getItem('user') as string)._id
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const params = useParams()

    const [groupId, setGroupId] = useState(group._id)
    const userId = JSON.parse(localStorage.getItem('user') as string)._id

    useEffect(() => {
        setGroupId(group._id)
        function connect() {
            const ws = new WebSocket(`ws://localhost:8080/ws?username=${userId}&groupId=${groupId}`)

            ws.onopen = () => console.log('WebSocket Connected')

            ws.onmessage = (e) => {
                const msg = JSON.parse(e.data)

                if (msg.typing && msg.groupId === params.teamId) {
                    setIsTyping(true)
                    setTypingName(msg.sentFrom)
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current)
                    }
                    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 10000)
                } else if (msg.groupId === params.teamId) {
                    setIsTyping(false)
                    const msgBody: Message = JSON.parse(e.data)
                    onSendMessage(msgBody)
                }
            }

            ws.onerror = (error) => console.error('WebSocket Error:', error)

            setWs(ws)
        }

        connect()

        return () => {
            console.log('closing websocket')
            ws?.close()
        }
    }, [group._id]) // Empty dependency array ensures this effect runs only once on mount

    function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (!ws) {
            console.error('WebSocket is not connected.')
            return
        }

        const msgBody: Message = {
            content: message,
            recipient: group.members, // Assuming this is correctly an array
            sentFrom: JSON.parse(localStorage.getItem('user') as string)._id,
            timestamp: Date.now(),
            groupId: group._id,
        }
        onSendMessage(msgBody) // Assuming you want to do something with this on the parent component

        ws.send(JSON.stringify(msgBody))
        setMessage('') // Clear message input after sending
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleTyping()
        setMessage(e.target.value)
    }

    function handleTyping() {
        if (!ws) {
            console.log('WS disconnected')
            return
        }
        const typingMessage = {
            typing: true,
            sentFrom: currentUserID,
            recipient: group.members,
            groupId: group._id,
        }

        ws.send(JSON.stringify(typingMessage))
    }

    return (
        <div className="w-full flex">
            <div className="m-2 p-2 bg-stone-800 flex flex-grow h-min-[50px] rounded-2xl text-xl">
                <input
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    className="bg-slate-700 mr-2 rounded-xl p-2 flex-grow bg-transparent hover:border-stone-400 border-2"
                />
                <button className="text-white hover:text-slate-400 p-2 " onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    )
}
