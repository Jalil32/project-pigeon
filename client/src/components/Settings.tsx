import LoginInput from './LoginInput'
import { Avatar } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { FormEvent } from 'react'
import { UserType, WorkspaceType } from '../types'
import { redirect } from 'react-router-dom'
import axios from 'axios'

interface Props {
    activeWorkspace: WorkspaceType
    setActiveWorkspace: Dispatch<SetStateAction<WorkspaceType | undefined>>
    people: UserType[]
}

function Settings({ activeWorkspace, setActiveWorkspace, people }: Props) {
    const navigate = useNavigate()
    const [workspaceNameCheck, setWorkspaceNameCheck] = useState<string>('')
    const [newName, setNewName] = useState<string>('')

    let showWorkspace = workspaceNameCheck === activeWorkspace.name
    let nameChanged = newName.length > 0

    async function handleDeleteWorkspace(event: any) {
        try {
            event.preventDefault()

            // Delete workspace
            console.log('deleting workspace')

            const request = await axios.delete(`/api/v1/workspace/${activeWorkspace!._id}`)

            if (request.status === 200) {
                // if request was successful redirect to select workspace page (need to make this)
                console.log('redirecting')
                navigate('/')
            }
        } catch {
            console.log('error deleting team')
        }
    }

    async function handleChangeName(event: FormEvent<HTMLButtonElement>) {
        try {
            event.preventDefault()

            const request = await axios.patch(`/api/v1/workspace/name/${activeWorkspace!._id}`, {
                name: newName,
            })

            if (request.status === 200) {
                setActiveWorkspace(request.data.workspace)
                navigate(`/workspace/${activeWorkspace!._id}`)
            }
        } catch {
            console.log('error changing name')
        }
    }

    async function removePerson(person: UserType) {
        console.log('removing person', person)
        // remove person from workspace
        // reload page
    }

    return (
        <div className="shadow-2xl border-2 border-stone-700 space-y-6 text-[20px] text-stone-400 m-8 font-noto font-medium rounded-2xl p-6 flex flex-col flex-grow bg-stone-800">
            <div className="text-[50px] text-slate-300 font-noto font-bold  p-2  inline-flex w-full focus-visible:ring-opacity-75">
                Workspace Settings
            </div>
            <form className="shadow-2xl border-stone-700 border-2 rounded-2xl p-2">
                <div className="p-2">Change Workspace Name</div>
                <div className="flex flex-row">
                    <div className="relative rounded-2xl bg-stone-700 min-h-[65px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
                        <label
                            htmlFor="Add email"
                            className="text-stone-400 mt-2 ps-4 lg:text-sm md:text-sm text-[10px] border-transparent"
                        >
                            New workspace name
                        </label>
                        <input
                            id="Add email"
                            autoComplete="on"
                            className=" pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl  appearance-none bg-transparent "
                            onChange={(event: FormEvent<HTMLInputElement>) => setNewName(event.currentTarget.value)}
                            value={newName}
                        />
                    </div>
                </div>
                <button
                    onClick={handleChangeName}
                    className={`ml-3 mt-2 ${nameChanged ? 'text-blue-500' : 'text-stone-400'}`}
                >
                    Save
                </button>
            </form>
            <div className="shadow-2xl border-2 border-stone-700 rounded-2xl p-2">
                <div className="p-2">Workspace People</div>
                <div className=" text-[20px]">
                    <ul className="space-y-8 p-4 ">
                        {people.map((person: UserType) => {
                            return (
                                <li key={person._id} className="justify-between flex space-x-3 flex-row items-center">
                                    <div className="flex flex-row justify-center items-center space-x-3">
                                        <Avatar>{`${person.firstName[0]}${person.lastName[0]}`}</Avatar>
                                        <div className="">{`${person.firstName} ${person.lastName}`}</div>
                                    </div>
                                    <button
                                        className="text-red-500 ml-2 rounded-2xl"
                                        onClick={() => removePerson(person)}
                                    >
                                        Remove from workspace
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <form onSubmit={handleDeleteWorkspace} className="shadow-2xl border-stone-700 p-2 border-2 rounded-2xl">
                <div className="pl-3 pb-2 text-red-500">Delete Workspace</div>
                <div className="flex flex-row">
                    <div className="relative rounded-2xl bg-stone-700 min-h-[65px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
                        <label
                            htmlFor="Add email"
                            className="text-stone-400 mt-2 ps-4 lg:text-sm md:text-sm text-[10px] border-transparent"
                        >
                            Enter the name of the workspace to delete
                        </label>
                        <input
                            id="Add email"
                            autoComplete="on"
                            className=" pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl  appearance-none bg-transparent "
                            onChange={(event: FormEvent<HTMLInputElement>) =>
                                setWorkspaceNameCheck(event.currentTarget.value)
                            }
                            value={workspaceNameCheck}
                        />
                    </div>
                </div>
                {showWorkspace && (
                    <button className={`${showWorkspace ? 'text-blue-500' : 'text-stone-500'} ml-3 mt-2 rounded-2xl`}>
                        Delete
                    </button>
                )}
            </form>
        </div>
    )
}

export default Settings
