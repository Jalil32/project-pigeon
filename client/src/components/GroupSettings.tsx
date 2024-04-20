import { Avatar } from '@mui/material'
import { useState, FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserType } from '../types'

interface Props {
    group?: any
}

function GroupSettings({ group }: Props) {
    const navigate = useNavigate()
    const [groupNameCheck, setGroupNameCheck] = useState<string>('')
    const [newName, setNewName] = useState<string>('')

    let showGroup = group.name === groupNameCheck
    let nameChanged = newName.length > 0

    async function handleDeleteWorkspace(event: any) {
        try {
            event.preventDefault()

            // Delete workspace
            console.log('deleting workspace')

            // if request was successful redirect to select workspace page (need to make this)
        } catch {
            console.log('error deleting team')
        }
    }

    async function handleChangeName(event: FormEvent<HTMLButtonElement>) {
        try {
            event.preventDefault()
        } catch {
            console.log('error changing name')
        }
    }

    return (
        <div className="p-6 mb-6 mt-6 space-y-6 rounded-2xl text-[20px] border-2 border-stone-700 h-full flex flex-col ml-6 mr-6 bg-stone-800 shadow-2xl">
            <form className="shadow-2xl border-stone-700 border-2 rounded-2xl p-2">
                <div className="p-2">Change Team Name</div>
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
            <form onSubmit={handleDeleteWorkspace} className="shadow-2xl border-stone-700 p-2 border-2 rounded-2xl">
                <div className="pl-3 pb-2 text-red-500">Delete Team</div>
                <div className="flex flex-row">
                    <div className="relative rounded-2xl bg-stone-700 min-h-[65px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
                        <label
                            htmlFor="Add email"
                            className="text-stone-400 mt-2 ps-4 lg:text-sm md:text-sm text-[10px] border-transparent"
                        >
                            Enter the name of the team to delete
                        </label>
                        <input
                            id="Add email"
                            autoComplete="on"
                            className=" pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl  appearance-none bg-transparent "
                            onChange={(event: FormEvent<HTMLInputElement>) =>
                                setGroupNameCheck(event.currentTarget.value)
                            }
                            value={groupNameCheck}
                        />
                    </div>
                </div>
                {showGroup && (
                    <button className={`${showGroup ? 'text-blue-500' : 'text-stone-500'} ml-3 mt-2 rounded-2xl`}>
                        Delete
                    </button>
                )}
            </form>
        </div>
    )
}

export default GroupSettings
