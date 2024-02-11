import { NavLink, useParams } from 'react-router-dom'
import Popup from 'reactjs-popup'
import CreateTeam from '../components/CreateTeam'
import { Collapse } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useState, Dispatch, SetStateAction } from 'react'
import { WorkspaceType } from '../types'

interface Group {
    _id: string
    name: string
}

interface Props {
    setGroups: Dispatch<SetStateAction<Group[]>>
    groups: Group[]
    activeWorkspace: WorkspaceType | undefined
}

function TeamSelection({ setGroups, groups, activeWorkspace }: Props) {
    const params = useParams()
    const [openTeams, setOpenTeams] = useState(false)

    const handleTeamClick = () => {
        setOpenTeams((openTeams: boolean) => {
            return !openTeams
        })
    }

    return (
        <>
            <div
                className="mb-8   flex flex-row justify-between text-[35px] text-stone-400 select-none p-0 h-fit"
                onClick={handleTeamClick}
            >
                Teams
                <div className="justify-self-end self-end">
                    {openTeams ? (
                        <CloseIcon sx={{ fontSize: 35 }} />
                    ) : (
                        <AddIcon sx={{ fontSize: 35, fontStyle: 'bold' }} />
                    )}
                </div>
            </div>

            <Collapse in={openTeams} timeout="auto" unmountOnExit>
                <ul className="list-inside text-[20px] ">
                    {groups.map((group: any) => {
                        return (
                            <li key={group._id} className="mb-8">
                                {' '}
                                {/* Assuming each group has a unique 'id' property */}
                                <NavLink
                                    to={`${params.workspaceId}/team/${group._id}`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'text-sky-400 pl-3'
                                            : 'text-slate-300 hover:text-slate-400'
                                    }
                                >
                                    {group.name}{' '}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>

                <Popup
                    trigger={
                        <button className="hover:text-slate-400 mb-8 w-fit">
                            + Create Team
                        </button>
                    }
                    modal
                    nested
                    position="center center"
                >
                    {
                        ((close: any) => (
                            <CreateTeam
                                activeWorkspace={activeWorkspace}
                                setGroups={setGroups}
                                groups={groups}
                                close={close}
                            />
                        )) as unknown as React.ReactNode
                    }
                </Popup>
            </Collapse>
        </>
    )
}

export default TeamSelection
