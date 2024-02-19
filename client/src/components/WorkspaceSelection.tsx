import { useState } from 'react'
import { WorkspaceType } from '../types'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup'
import CreateWorkspace from './CreateWorkspace'

const ITEM_HEIGHT = 48

interface Props {
    activeWorkspace: WorkspaceType | undefined // Assuming activeWorkspace might not be set initially
    workspaces: WorkspaceType[]
    setActiveWorkspace: React.Dispatch<React.SetStateAction<WorkspaceType | undefined>> // Updated type for useState setter
}
export default function WorkspaceSelection({ setActiveWorkspace, activeWorkspace, workspaces }: Props) {
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

    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div className=" flex flex-row text-[30px] text-stone-400 mb-6 items-center justify-center">
                <div className="relative inline-block  w-full">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hover:bg-stone-900 rounded-2xl p-4 items-center justify-center inline-flex w-full focus-visible:ring-opacity-75"
                    >
                        {activeWorkspace === undefined ? '' : activeWorkspace?.name}
                    </button>

                    <div
                        className={`w-full origin-top absolute left-1/2 -translate-x-1/2 mt-2 transform transition ease-out duration-300 ${
                            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{ transformOrigin: 'center center' }}
                    >
                        <div className="overflow-hidden rounded-lg shadow shadow-stone-950 ring-1 ring-black ring-opacity-5">
                            <div className="items-start bg-[#292221] p-1 hex flex-col">
                                {workspaces.map((workspace: WorkspaceType) => {
                                    return (
                                        <button
                                            onClick={() => selectWorkspace(workspace)}
                                            className="text-start rounded-lg block p-2 text-[20px] text-white hover:bg-stone-900 w-full"
                                        >
                                            <div className="pl-1">
                                                {workspace.name +
                                                    (activeWorkspace?.name === workspace.name ? ' -' : '')}
                                            </div>
                                            <div className="text-[16px] p-1 text-stone-400">4 members</div>
                                        </button>
                                    )
                                })}
                                <div className="w-full border-t-2 font-normal border-stone-400 mt-2">
                                    <Popup
                                        trigger={
                                            <button className="w-full text-left mt-2 text-[20px] hover:bg-stone-900 rounded-lg p-2">
                                                + Create a new workspace
                                            </button>
                                        }
                                        modal
                                        nested
                                        position="center center"
                                    >
                                        {((close: any) => <CreateWorkspace />) as unknown as React.ReactNode}
                                    </Popup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
