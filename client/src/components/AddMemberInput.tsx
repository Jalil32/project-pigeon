import { useState, FormEvent } from 'react'
import validator from 'validator'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { FunctionTypeNode } from 'typescript'

interface props {
    handleRemoveMember: (data: any) => void
    handleAddMember: () => void
    handleInput: (event: FormEvent<HTMLInputElement>) => void
    email: string
    emails: string[]
}

function AddMemberInput({
    handleRemoveMember,
    handleAddMember,
    handleInput,
    email,
    emails,
}: props) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="relative rounded-2xl bg-stone-700 min-h-[65px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
                <label
                    htmlFor="Add email"
                    className="text-stone-400 mt-2 ps-4 lg:text-sm md:text-sm text-[10px] border-transparent"
                >
                    Add people or emails
                </label>
                <input
                    id="Add email"
                    autoComplete="on"
                    className="pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl  appearance-none bg-transparent "
                    onChange={handleInput}
                    value={email}
                />
            </div>
            <div className="flex flex-row flex-wrap">
                {emails.map((e, index) => {
                    return (
                        <ul className="flex flex-row m-1 text-sm text-sky-600 border-2 border-sky-600 w-fit p-1 ps-2 pe-2 rounded-lg">
                            <li key={index}>{e}</li>
                            <button
                                type="button"
                                value={e}
                                onClick={(e) => handleRemoveMember(e)}
                                className="hover:text-red-400"
                            >
                                <div>&nbsp;X</div>{' '}
                            </button>
                        </ul>
                    )
                })}
            </div>
            {validator.isEmail(email) && (
                <button
                    onClick={handleAddMember}
                    type="button"
                    className="flex flex-row hover:text-sky-600 align-items-center"
                >
                    <PersonAddIcon />
                    <div className="ml-2">{email}</div>
                </button>
            )}
        </div>
    )
}

export default AddMemberInput
