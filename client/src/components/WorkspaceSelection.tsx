import { ReactNode, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { deepOrange, deepPurple } from '@mui/material/colors'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { createTheme } from '@mui/material'
import Chat from '../chat'
import { WorkspaceType } from '../types'
import { Navigate, useNavigate } from 'react-router-dom'

const ITEM_HEIGHT = 48

interface Props {
    activeWorkspace: WorkspaceType | undefined // Assuming activeWorkspace might not be set initially
    workspaces: WorkspaceType[]
    setActiveWorkspace: React.Dispatch<
        React.SetStateAction<WorkspaceType | undefined>
    > // Updated type for useState setter
}
export default function WorkspaceSelection({
    setActiveWorkspace,
    activeWorkspace,
    workspaces,
}: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const navigate = useNavigate()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const selectWorkspace = (workspace: WorkspaceType) => {
        setActiveWorkspace(workspace)
        navigate(`/workspace/${workspace._id}`)
    }

    return (
        <>
            <div className="flex flex-row text-[30px] text-stone-400 mb-6 items-center justify-between">
                <div className="self-center justify-self-center pb-1">
                    {activeWorkspace === undefined ? '' : activeWorkspace?.name}
                </div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon sx={{ color: '#A8A29E' }} />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {workspaces.map((workspace: any) => {
                        if (workspace.name !== activeWorkspace?.name) {
                            return (
                                <MenuItem key={workspace._id}>
                                    <button
                                        onClick={() =>
                                            selectWorkspace(workspace)
                                        }
                                    >
                                        {workspace.name}
                                    </button>
                                </MenuItem>
                            )
                        }
                    })}
                    <MenuItem key={'create'}>
                        <button>+ create workspace</button>
                    </MenuItem>
                </Menu>
            </div>
        </>
    )
}
