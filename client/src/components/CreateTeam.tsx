import LoginInput from './LoginInput'

import { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import LoginButton from './LoginButton'
import AddMemberInput from './AddMemberInput'
import { FormEvent } from 'react'
import axios from 'axios'
import { redirect, useParams } from 'react-router-dom'
import { error } from 'console'

interface props {
    setGroups: (data: any) => void
    groups: any
    close?: any
    activeWorkspace: any
}

export default function CreateTeam({
    setGroups,
    groups,
    close,
    activeWorkspace,
}: props) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [emails, setEmails] = useState<string[]>([])
    const workspaceId = useParams().workspaceId

    function handleAddMember() {
        setEmails((emails) => {
            return [...emails, email]
        })
        setEmail('')
    }

    function handleRemoveMember(member: any) {
        const memberToRemove = member.currentTarget.value
        let newEmails: string[] = []
        emails.forEach((el) => {
            if (el !== memberToRemove) {
                newEmails.push(el)
            }
        })

        setEmails(newEmails)
    }

    function handleInput(event: FormEvent<HTMLInputElement>) {
        const currentEmail = event.currentTarget.value
        setEmail(currentEmail)
    }

    async function handleSubmit(event: any) {
        try {
            event.preventDefault()

            const fd = new FormData(event.target)
            const data = Object.fromEntries(fd.entries())
            const name = data.name
            const user = JSON.parse(localStorage.getItem('user') ?? '')
            let userId = ''

            if (user) {
                userId = user._id
            }

            const request = {
                name: name,
                creator: userId,
                workspace: activeWorkspace._id,
                members: activeWorkspace.members,
            }

            const response = await axios.post('/api/v1/group', request)
            if (response.status === 201) {
                const groupToAdd = response.data.data.group

                const navigateTo = `/workspace/${workspaceId}/team/${groupToAdd._id}`

                setGroups((groups: any) => {
                    return [...groups, groupToAdd]
                })

                close()
                navigate(navigateTo)
            }
        } catch (error) {
            console.error('error:', error)
        }
    }

    return (
        <div className="w-[500px] h-[500px] bg-stone-800 rounded-2xl shadow-2xl p-8">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 lg:text-[35px] md:text-[30px] sm:text-[30px] text-stone-400 font-noto font-bold">
                <div className="flex flex-row justify-between">
                    <div>Create Team</div>
                    <button className="hover:text-sky-400" onClick={close}>
                        x
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="md:space-y-8 lg:space-y-8 space-y-4 text-[20px]"
                >
                    <LoginInput name="name" label="Name" />
                    <AddMemberInput
                        handleInput={handleInput}
                        handleAddMember={handleAddMember}
                        handleRemoveMember={handleRemoveMember}
                        email={email}
                        emails={emails}
                    />
                    <LoginButton type="submit" buttonText="Create Team" />
                </form>
            </div>
        </div>
    )
}
