import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'

// Define a type for the message, it can be as simple as a string, or more complex if needed
type Message = string

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState<string>('')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [user, setUser] = useState<string>('')
    const [group, setGroup] = useState<string>('')
    const [openSocket, setOpenSocket] = useState<boolean>(false)

    let groupOneMembers = ['jalil', 'Rea', 'Jason']

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUser(event.currentTarget.value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setOpenSocket(true)
        }
    }

    useEffect(() => {
        if (user) {
            // Create WebSocket connection.
            const newWs = new WebSocket(
                `ws://127.0.0.1:8080/ws?username=${user}`
            )

            // Connection opened
            newWs.addEventListener('open', (_event) => {
                console.log('Connected to WS Server')
            })
            // Listen for messages
            newWs.addEventListener('message', (event) => {
                setMessages((prevMessages) => [...prevMessages, event.data])
            })

            setWs(newWs)

            // Cleanup on unmount
            return () => {
                newWs.close()
            }
        }
    }, [openSocket])

    const hello = 'hello world'
    const sendMessage = () => {
        if (ws) {
            let message = {
                message: inputMessage,
                sender: user,
                receiver: group,
            }
            ws.send(JSON.stringify(message))
            setInputMessage('')
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputMessage(event.target.value)
    }

    const handleGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroup(event.target.value)
    }

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
            <input
                id="groupInput"
                type="text"
                value={group}
                onChange={handleGroupChange}
            />
            <p>Your group is: {group}</p>
            <label>
                Your Name:{' '}
                <input
                    name="myInput"
                    onChange={handleNameChange}
                    onKeyDown={handleKeyDown}
                />
            </label>
            <div>Group Chat 1</div>
            <div>Members:</div>
            <ul>
                {groupOneMembers.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default Chat
