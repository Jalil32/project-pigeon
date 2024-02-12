import { useRef, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import { SendMessage } from './components/SendMessage'
import { Circle } from '@mui/icons-material'
import {  deepPurple } from '@mui/material/colors'
import Message from './components/Message'


interface Group {
    _id: string
    name: string
}

interface Member {
    _id: string
    firstName: string
}

interface MessageType {
    sentFrom: string
    content: string
    timestamp: number
    recipient: string
    groupId: string
}

const useMembers = (teamId: string) => {
    const [members, setMembers] = useState<{ [key: string]: Member }>({})

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`/api/v1/user/group/${teamId}`)
                let membersObj = response.data.users.reduce((acc: { [key: string]: Member }, member: Member) => {
                    acc[member._id] = member
                    return acc
                }, {})

                console.log('members:', membersObj)
                setMembers(membersObj)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }
        fetchMembers()
    }, [teamId])

    return members
}

interface props {
    groups?: any
}

function Chat({ groups }: props) {
    const params = useParams()
    const currentUserID = JSON.parse(localStorage.getItem('user') || '{}')._id
    const group = groups.find((g: Group) => g._id === params.teamId)
    const members = useMembers(params.teamId as string)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
	const [isTyping, setIsTyping] = useState(false)
    const [typingName, setTypingName] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/v1/message/${params.teamId}`)
                setMessages(response.data.data.messages)
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }
        fetchData()
    }, [params.teamId])

    useEffect(() => {
        const scrollContainer = messagesContainerRef.current
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
    }, [messages, isTyping])

    const addMessage = (newMessage: MessageType) => {
        setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    return (
        <div className="h-screen flex flex-col justify-between w-[80%]">
            <div className="flex p-5 justify-between items-center flex-row	rounded-2xl m-6 bg-stone-800 text-[35px] text-slate-400">
                <div className="">{group?.name}</div>
                <button className="space-x-4">
                    <PersonAddIcon sx={{ fontSize: 40 }}></PersonAddIcon>
                    <SettingsIcon sx={{ fontSize: 40 }}></SettingsIcon>
                </button>
            </div>
            {messages.length === 0 && (
                <div className="leading-none font-noto font-bold ml-8 mt-6 text-stone-800 lg:text-[60px] md:text-[40px] sm:text-[20px] ">
                    Send a message <br /> to start a conversation.
                </div>
            )}
            <div
                ref={messagesContainerRef}
                className="flex flex-col flex-grow p-5 text-slate-300 space-y-4 overflow-y-auto overflow-visible"
            >
                {messages.map((message) => (
					<Message message={message} currentUserId={currentUserID} members={members}/>
               ))}
                {isTyping && typingName && (
                    <div>
                        <div className="text-sky-900 ml-3 mr-3 text-[16px] font-semibold">
                            {members[typingName]?.firstName || 'error'}
                        </div>
                        <div className="typing-dots p-2 h-auto bg-stone-800 rounded-2xl w-fit">
                            <span>
                                <Circle sx={{ fontSize: 10 }}></Circle>
                            </span>
                            <span>
                                <Circle sx={{ fontSize: 10 }}></Circle>
                            </span>

                            <span>
                                <Circle sx={{ fontSize: 10 }}></Circle>
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {group && (
                <SendMessage
                    onSendMessage={addMessage}
                    group={group}
                    setIsTyping={setIsTyping}
                    setTypingName={setTypingName}
                />
            )}
        </div>
    )
}

export default Chat
