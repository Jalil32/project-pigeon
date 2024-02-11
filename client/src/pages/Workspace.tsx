import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Chat from '../chat'
import WorkspaceSelection from '../components/WorkspaceSelection'
import TeamSelection from '../components/TeamSelection'
import PeopleSelection from '../components/PeopleSelection'
import DirectChatSelection from '../components/DirectChatSelection'
import GlobalSettings from '../components/GlobalSettings'
import { WorkspaceType } from '../types'

function Workspace() {
    const navigate = useNavigate()
    const params = useParams()
    const [workspaces, setWorkspaces] = useState<any>([])
    const [groups, setGroups] = useState<any>([])
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType | undefined>(undefined)

    useEffect(() => {
        const fetchWorkspaces = async (workspaceIds: any) => {
            const requests = workspaceIds.map((id: any) => axios.get(`/api/v1/workspace/${id}`))
            const responses = await Promise.all(requests)

            return responses.map((response: any) => response.data.workspace)
        }

        const fetchData = async () => {
            try {
                let user: string = localStorage.getItem('user') as string
                let userData = JSON.parse(user)

                const response = await axios.get(`/api/v1/user/${userData._id}`)
                const usersWorkspaces = response.data.user.workspaces

                const workspaceToAdd = await fetchWorkspaces(usersWorkspaces)

                if (workspaces.length === 0) {
                    setWorkspaces(workspaceToAdd)
                    setActiveWorkspace(workspaceToAdd[0])
                    navigate(`/workspace/${workspaceToAdd[0]._id}`)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchGroups = async (groupIds: any) => {
            const requests = groupIds.map((id: any) => axios.get(`/api/v1/group/${id}`))
            const responses = await Promise.all(requests)
            return responses.map((response) => response.data.group)
        }

        const fetchData = async () => {
            if (activeWorkspace) {
                const groupsToAdd = await fetchGroups(activeWorkspace.groups)
                setGroups(groupsToAdd)
                localStorage.setItem('groups', JSON.stringify(groupsToAdd))
            }
        }

        fetchData()
    }, [activeWorkspace])

    const selectWorkspace = (workspace: WorkspaceType) => {
        navigate(`/workspace/${workspace._id}`)
        setActiveWorkspace(workspace)
    }

    return (
        <div className=" bg-gradient-to-tr from-green-400 to-cyan-600  flex w-screen h-screen">
            <div className="select-none  text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl flex flex-col bg-stone-800 h-full w-1/4">
                <WorkspaceSelection
                    activeWorkspace={activeWorkspace}
                    workspaces={workspaces}
                    setActiveWorkspace={setActiveWorkspace}
                ></WorkspaceSelection>
                <div className="border-[2px] border-stone-400 mb-8 rounded-2xl"></div>
                <div className=" overflow-y-scroll hide-scrollbar flex-grow">
                    <TeamSelection
                        activeWorkspace={activeWorkspace}
                        setGroups={setGroups}
                        groups={groups}
                    ></TeamSelection>
                    <PeopleSelection />
                    <DirectChatSelection />
                </div>
                <GlobalSettings />
            </div>
            {params.teamId !== undefined && <Chat groups={groups} />}
        </div>
    )
}

export default Workspace
