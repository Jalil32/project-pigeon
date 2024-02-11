import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

function DirectChatSelection() {
    const [openChat, setOpenChat] = useState(false)
    const handleChatClick = () => {
        setOpenChat((openChat: boolean) => {
            return !openChat
        })
    }
    return (
        <div
            className="mb-8 flex flex-row justify-between text-[35px] text-stone-400 select-none p-0 h-fit"
            onClick={handleChatClick}
        >
            Direct Chat
            <div className="ml-6 justify-self-end self-end">
                {openChat ? (
                    <CloseIcon sx={{ fontSize: 35 }} />
                ) : (
                    <AddIcon sx={{ fontSize: 35, fontStyle: 'bold' }} />
                )}
            </div>
        </div>
    )
}

export default DirectChatSelection
