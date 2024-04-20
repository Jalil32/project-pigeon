import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Chat from '../chat'
import WorkspaceSelection from '../components/WorkspaceSelection'
import TeamSelection from '../components/TeamSelection'
import PeopleSelection from '../components/PeopleSelection'
import DirectChatSelection from '../components/DirectChatSelection'
import GlobalSettings from '../components/GlobalSettings'
import { WorkspaceType } from '../types'
import Settings from '../components/Settings'

function Workspace() {
    const navigate = useNavigate()
    const params = useParams()
    const [workspaces, setWorkspaces] = useState<any>([])
    const [groups, setGroups] = useState<any>([])
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>()
    const [people, setPeople] = useState<any>([])
    const location = useLocation()

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

                    workspaceToAdd.forEach((workspace: WorkspaceType) => {
                        if (workspace._id === params.workspaceId) {
                            setActiveWorkspace(workspace)
                        }
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchGroups = async (groupIds: string[]) => {
            const requests = groupIds.map((id: any) => axios.get(`/api/v1/group/${id}`))
            const responses = await Promise.all(requests)
            return responses.map((response) => response.data.group)
        }

        const fetchPeople = async (memberIds: string[]) => {
            const requests = memberIds.map((id: string) => axios.get(`/api/v1/user/${id}`))
            const responses = await Promise.all(requests)
            return responses.map((response) => response.data.user)
        }

        const fetchData = async () => {
            if (activeWorkspace) {
                const groupsToAdd = await fetchGroups(activeWorkspace.groups as string[])
                setGroups(groupsToAdd)
                localStorage.setItem('groups', JSON.stringify(groupsToAdd))

                const peopleToAdd = await fetchPeople(activeWorkspace.members)
                console.log(people)
                setPeople(peopleToAdd)
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
            <div className=" select-none  border-r-2 border-stone-700 text-slate-300 leading-none font-noto font-bold p-8 shadow-2xl flex flex-col bg-stone-800 h-full min-w-[350px] max-w-[350px]">
                <WorkspaceSelection
                    activeWorkspace={activeWorkspace}
                    workspaces={workspaces}
                    setWorkspaces={setWorkspaces}
                    setActiveWorkspace={setActiveWorkspace}
                ></WorkspaceSelection>
                <div className="border-[2px] border-stone-400 mb-8 rounded-2xl"></div>
                <div className=" overflow-y-scroll hide-scrollbar flex-grow">
                    <TeamSelection
                        activeWorkspace={activeWorkspace}
                        setGroups={setGroups}
                        groups={groups}
                    ></TeamSelection>
                    {activeWorkspace && <PeopleSelection activeWorkspace={activeWorkspace} people={people} />}
                    <DirectChatSelection />
                </div>
                <GlobalSettings />
            </div>
            {params.teamId !== undefined && <Chat groups={groups} />}
            {location.pathname.includes('/settings') && activeWorkspace && (
                <Settings activeWorkspace={activeWorkspace!} setActiveWorkspace={setActiveWorkspace} people={people} />
            )}
        </div>
    )
}

export default Workspace
