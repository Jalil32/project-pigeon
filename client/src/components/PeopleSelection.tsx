import { Dispatch, SetStateAction, useState } from 'react'
import Popup from 'reactjs-popup'
import CreateTeam from '../components/CreateTeam'
import { List, Collapse, ListItemButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import Avatar from '@mui/material/Avatar'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { PeopleSharp } from '@mui/icons-material'
import { UserType, WorkspaceType } from '../types'
import InvitePopup from './InvitePopup'

interface Props {
    people: UserType[]
    activeWorkspace: WorkspaceType
}

function PeopleSelection({ people, activeWorkspace }: Props) {
    const [openPeople, setOpenPeople] = useState(false)
    const handlePeopleClick = () => {
        setOpenPeople((openPeople: boolean) => {
            return !openPeople
        })
    }

    const colors = [deepOrange[500], deepPurple[500]]

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
                <div className=" space-y-8 text-[20px] mb-8">
                    <ul className="space-y-8">
                        {people.map((person: UserType) => {
                            return (
                                <li key={person._id} className=" flex space-x-3 flex-row items-center">
                                    <Avatar
                                        sx={{ bgcolor: colors[Math.floor(Math.random() * 2)] }}
                                    >{`${person.firstName[0]}${person.lastName[0]}`}</Avatar>
                                    <div className="">{`${person.firstName} ${person.lastName}`}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <Popup
                    trigger={<button className="text-[20px] hover:text-slate-400 mb-8 w-fit">+ Invite People</button>}
                    modal
                    nested
                    position="center center"
                >
                    {
                        ((close: any) => (
                            <InvitePopup activeWorkspace={activeWorkspace} close={close} />
                        )) as unknown as React.ReactNode
                    }
                </Popup>
            </Collapse>
        </>
    )
}

export default PeopleSelection
