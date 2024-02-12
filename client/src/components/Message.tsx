import Avatar from '@mui/material/Avatar'
import { deepOrange, deepPurple } from '@mui/material/colors'

interface MessageType {
    sentFrom: string
    content: string
    timestamp: number
    recipient: string
    groupId: string
}

interface Member {
    _id: string
    firstName: string
}

interface Props {
    message: MessageType
    members: { [key: string]: Member }
    currentUserId: string
}

function Message({ message, members, currentUserId }: Props) {
    const left = true

    return (
        <div>
            {currentUserId === message.sentFrom ? (
                <div
                    key={message.timestamp}
                    className={`flex ${message.sentFrom === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex flex-row max-w-[60%] `}>
                        <div className="flex items-end flex-col ">
                            <div
                                className={` text-purple-800 ml-3 mr-3 text-[16px] font-semibold w-fit justify-end items-end `}
                            >
                                {members[message.sentFrom]?.firstName || 'error'}
                            </div>
                            <div className="flex-grow p-3 h-auto bg-stone-800 rounded-2xl">{message.content}</div>
                            <div className="mr-3 font-semibold text-stone-600 text-[12px]">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <div
                            className={`${
                                message.sentFrom === currentUserId ? 'justify-start' : 'justify-end'
                            } flex pl-2 space-x-3 flex-row items-center`}
                        >
                            <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                {members[message.sentFrom]?.firstName
                                    ?.split(' ')
                                    .map((part) => part[0])
                                    .join('')
                                    .toUpperCase()}
                            </Avatar>
                        </div>
                    </div>{' '}
                </div>
            ) : (
                <div
                    key={message.timestamp}
                    className={`flex ${message.sentFrom === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex flex-row max-w-[60%]`}>
                        <div
                            className={`${
                                message.sentFrom === currentUserId ? 'justify-start' : 'justify-end'
                            } flex pr-2 space-x-3 flex-row items-center`}
                        >
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                {members[message.sentFrom]?.firstName
                                    ?.split(' ')
                                    .map((part) => part[0])
                                    .join('')
                                    .toUpperCase()}
                            </Avatar>
                        </div>
                        <div className="flex items-start flex-col ">
                            <div
                                className={` text-purple-800 ml-3 mr-3 text-[16px] font-semibold w-fit justify-end items-end `}
                            >
                                {members[message.sentFrom]?.firstName || 'error'}
                            </div>
                            <div className="flex-grow p-3 h-auto bg-stone-800 rounded-2xl">{message.content}</div>
                            <div className="ml-3 font-semibold text-stone-600 text-[12px]">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>{' '}
                </div>
            )}
        </div>
    )
}

export default Message
