import { useRef, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import { SendMessage } from './components/SendMessage'
import { Circle } from '@mui/icons-material'
import { deepOrange, deepPurple } from '@mui/material/colors'
import Message from './components/Message'
import GroupSettings from './components/GroupSettings'
import { useLocation } from 'react-router-dom'
import { UserType } from './types'
import AvatarGroup from '@mui/material/AvatarGroup'

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
    onModel: string
}

const useMembers = (workspaceId: string) => {
    const [members, setMembers] = useState<{ [key: string]: UserType }>({})

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`/api/v1/user/group/${workspaceId}`)
                let membersObj = response.data.users.reduce((acc: { [key: string]: UserType }, member: UserType) => {
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
    }, [workspaceId])

    return members
}

interface props {
    groups?: any
}

function Chat({ groups }: props) {
    const params = useParams()
    const currentUserID = JSON.parse(localStorage.getItem('user') || '{}')._id
    const location = useLocation()
    const group = groups.find((g: Group) => g._id === params.teamId)
    const members = useMembers(params.workspaceId as string)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [typingName, setTypingName] = useState<string>('')
    const navigate = useNavigate()

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
        <div className="h-screen bg-transparent flex flex-col justify-between flex-grow overflow-visible">
            <div className="border-2 m-6 mb-0 shadow-2xl border-stone-700 flex p-3 justify-between items-center flex-row	rounded-2xl bg-stone-800 text-[35px] text-slate-400">
                <div className="leading-none font-noto font-bold">{group?.name}</div>
                <div className="flex flex-row space-x-6">
                    <div className="flex flex-row">
                        <AvatarGroup>
                            {Object.values(members).map((member: UserType) => {
                                return <Avatar>{member.firstName[0] + member.lastName[0]}</Avatar>
                            })}
                        </AvatarGroup>
                    </div>
                    <div className="space-x-4">
                        <button>
                            <PersonAddIcon sx={{ fontSize: 40 }}></PersonAddIcon>
                        </button>
                        <button
                            onClick={() => {
                                navigate(`${params.workspaceId}/team/${params.teamId}/groupsettings`)
                            }}
                        >
                            <SettingsIcon sx={{ fontSize: 40 }}></SettingsIcon>
                        </button>
                    </div>
                </div>
            </div>
            {messages.length === 0 && (
                <div className="leading-none font-noto font-bold ml-8 mt-6 text-stone-800 lg:text-[60px] md:text-[40px] sm:text-[20px] ">
                    Send a message <br /> to start a conversation.
                </div>
            )}
            {!location.pathname.includes('/groupsettings') && (
                <div
                    ref={messagesContainerRef}
                    className="  flex flex-col h-full p-10 text-slate-300 space-y-4 overflow-y-auto overflow-visible!"
                >
                    {messages.map((message) => (
                        <Message message={message} currentUserId={currentUserID} members={members} />
                    ))}
                    {isTyping && typingName && (
                        <div className="flex flex-row  items-end">
                            <div className={`flex pr-2 space-x-3 flex-row items-center`}>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{members[typingName].firstName[0]}</Avatar>
                            </div>
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
                        </div>
                    )}
                </div>
            )}
            {location.pathname.includes('/groupsettings') && <GroupSettings group={group}></GroupSettings>}

            {!location.pathname.includes('/groupsettings') && group && (
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
