import { Link, redirect, useActionData, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { WorkspaceType } from '../types'
import CreateWorkspace from '../components/CreateWorkspace'
import { Navigate } from 'react-router-dom'
import LoginInput from '../components/LoginInput'
import LoginButton from '../components/LoginButton'
import { NavigationSharp } from '@mui/icons-material'

interface authData {
    email: string
    password: string
    passwordConfirm?: string
    firstName?: string
    lastName?: string
    passwordChangedAt?: number
}

function WorkspaceSelect() {
    const [workspaces, setWorkspaces] = useState<any>([])
    const navigate = useNavigate()

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
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    async function handleSubmit(event: any) {
        try {
            event.preventDefault()

            const fd = new FormData(event.target)
            const data = Object.fromEntries(fd.entries())
            const name = data.name as string
            const user = JSON.parse(localStorage.getItem('user') ?? '')
            let userId = ''

            if (user) {
                userId = user._id
            }

            const newWorkspace: WorkspaceType = {
                name: name,
                creator: userId,
                members: [userId],
                createdAt: Date.now(),
            }

            const response = await axios.post('/api/v1/workspace', newWorkspace)

            if (response.status === 201) {
                const workspaceToAdd = response.data.workspace

                setWorkspaces((workspaces: any) => {
                    return [...workspaces, workspaceToAdd]
                })

                selectWorkspace(workspaceToAdd)
            }
        } catch (error) {
            console.error('error:', error)
        }
    }

    const selectWorkspace = (workspace: WorkspaceType) => {
        navigate(`/workspace/${workspace._id}`)
    }

    return (
        <div className="bg-gradient-to-tr from-green-400 to-cyan-600 flex w-screen h-screen items-center justify-center">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 flex  flex-col  text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl lg:rounded-[55px] sm:rounded-[55px] rounded-t-[55px] bg-stone-800 h-auto self-end md:self-center sm:min-h-[850px] lg:w-[550px] sm:w-[550px] w-full">
                <div className="lg:text-[35px] md:text-[30px] sm:text-[30px] text-stone-400">Pigeon</div>
                <div className=" md:text-[60px] text-[30px]">
                    Select <br /> A Workspace
                </div>
                <div className=" flex rounded-2xl shadow-2xl justify-self-center border-stone-700 border-2 p-1 hex flex-col">
                    {workspaces.map((workspace: WorkspaceType) => {
                        return (
                            <button
                                onClick={() => selectWorkspace(workspace)}
                                className="flex justify-between items-center text-start rounded-lg p-2 text-[20px] text-white hover:bg-stone-900 w-full"
                            >
                                <div>
                                    <div className="pl-1">{workspace.name}</div>
                                    <div className="text-[16px] p-1 text-stone-400">4 members</div>
                                </div>
                            </button>
                        )
                    })}
                </div>
                <div className=" md:text-[60px] text-[30px]">Or create one?</div>
                <div className=" flex p-4 rounded-2xl shadow-2xl justify-self-center border-stone-700 border-2 hex flex-col">
                    <form onSubmit={handleSubmit} className="space-y-4 text-[20px]">
                        <LoginInput name="name" label="Workspace Name" />
                        <button className="flex justify-center text-[25px] p-4 items-center text-start rounded-2xl text-white hover:bg-stone-900 w-full">
                            Create Workspace
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default WorkspaceSelect
