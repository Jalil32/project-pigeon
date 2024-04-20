import LoginInput from './LoginInput'
import LoginButton from './LoginButton'
import { WorkspaceType } from '../types'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    workspaces: WorkspaceType[]
    setWorkspaces: Dispatch<SetStateAction<WorkspaceType[]>>
    selectWorkspace: (workspace: WorkspaceType) => void
}

function CreateWorkspace({ workspaces, setWorkspaces, selectWorkspace }: Props) {
    const navigate = useNavigate()

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

            console.log(response)

            if (response.status === 201) {
                const workspaceToAdd = response.data.workspace

                const navigateTo = `/workspace/${workspaceToAdd}`

                setWorkspaces((workspaces: any) => {
                    return [...workspaces, workspaceToAdd]
                })

                selectWorkspace(workspaceToAdd)
            }
        } catch (error) {
            console.error('error:', error)
        }
    }

    return (
        <div className="w-[500px] border-stone-700 border-2 bg-stone-800 rounded-2xl shadow-2xl shadow-stone-950 ring-1 ring-black ring-opacity-5 p-8">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 lg:text-[35px] md:text-[30px] sm:text-[30px] text-stone-400 font-noto font-bold">
                <div className="flex flex-row justify-between">
                    <div>Create workspace</div>
                    <button className="hover:text-sky-400">x</button>
                </div>

                <form onSubmit={handleSubmit} className="md:space-y-8 lg:space-y-8 space-y-4 text-[20px]">
                    <LoginInput name="name" label="Workspace Name" />
                    <LoginButton type="submit" buttonText="Create Workspace" />
                </form>
            </div>
        </div>
    )
}

export default CreateWorkspace
