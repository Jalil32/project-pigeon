import { useState } from 'react'
import Popup from 'reactjs-popup'
import CreateTeam from '../components/CreateTeam'
import { List, Collapse, ListItemButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import Avatar from '@mui/material/Avatar'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { PeopleSharp } from '@mui/icons-material'

function PeopleSelection() {
    const [openPeople, setOpenPeople] = useState(false)
    const handlePeopleClick = () => {
        setOpenPeople((openPeople: boolean) => {
            return !openPeople
        })
    }

    return (
        <>
            <div
                className="mb-8  flex flex-row justify-between text-[35px] text-stone-400 select-none p-0 h-fit"
                onClick={handlePeopleClick}
            >
                People
                <div className="justify-self-end self-end">
                    {openPeople ? (
                        <CloseIcon sx={{ fontSize: 35 }} />
                    ) : (
                        <AddIcon sx={{ fontSize: 35, fontStyle: 'bold' }} />
                    )}
                </div>
            </div>

            <Collapse in={openPeople} timeout="auto" unmountOnExit>
                <div className="space-y-8 text-[20px] mb-8">
                    <div className="flex space-x-3 flex-row items-center">
                        <Avatar sx={{}}>RB</Avatar>
                        <div>Rea Baseley</div>
                    </div>
                    <div className="flex space-x-3 flex-row items-center">
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>JI</Avatar>
                        <div>Jalil Inayat-Hussain</div>
                    </div>
                    <div className="flex space-x-3 flex-row items-center">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>JM</Avatar>
                        <div>Jason Millman</div>
                    </div>
                </div>
            </Collapse>
        </>
    )
}

export default PeopleSelection
