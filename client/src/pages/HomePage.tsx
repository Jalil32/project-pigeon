import { useState } from 'react'

const MESSAGES = [
    {
        sentFrom: 'Jalil',
        content: 'Hello',
        timestamp: Date.now(),
        onModel: 'Groups',
    },
    {
        sentFrom: 'Rea',
        content: 'Going to the movies',
        timestamp: Date.now(),
        onModel: 'Groups',
    },
    {
        sentFrom: 'Michael',
        content: 'Nothing Much?',
        timestamp: Date.now(),
        onModel: 'Groups',
    },
]

function HomePage() {
    const [groups, setGroups] = useState({
        production: false,
        development: false,
        hr: false,
    })
    const options: any = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    // Get a Users Group
    function handleActiveButton(groupName: any) {
        const groupsCopy: any = { ...groups }

        groupsCopy[groupName] = true

        for (const group in groupsCopy) {
            if (group != groupName) {
                groupsCopy[group] = false
            }
        }

        setGroups(groupsCopy)
    }

    function getDate(timestamp: number) {
        return timestamp.toLocaleString('en-US', options)
    }

    let messageStyle = 'flex flex-coil items-start'

    function getCurrentUser(name: string) {
        if (name === 'Jalil') {
            messageStyle = 'flex flex-col items-end'
        } else {
            messageStyle = 'flex flex-col items-start'
        }
    }

    return (
        <div className="bg-gradient-to-tr from-green-400 to-cyan-600 flex w-screen h-screen items-start justify-start">
            <div className=" space-y-8 text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl flex flex-col bg-stone-800 h-full w-[400px] ">
                <div className="text-[35px] text-stone-400">Teams</div>
                <ol className="list-inside text-[20px] space-y-8">
                    <li
                        onClick={() => handleActiveButton('production')}
                        className={
                            groups['production']
                                ? 'text-sky-400 pl-3'
                                : 'text-slate-300 hover:text-slate-400'
                        }
                    >
                        Production Team
                    </li>
                    <li
                        onClick={() => handleActiveButton('development')}
                        className={
                            groups['development']
                                ? 'text-sky-400 pl-3'
                                : 'text-slate-300 hover:text-slate-400'
                        }
                    >
                        Development Team
                    </li>
                    <li
                        onClick={() => handleActiveButton('hr')}
                        className={
                            groups['hr']
                                ? 'text-sky-400 pl-3'
                                : 'text-slate-300 hover:text-slate-400'
                        }
                    >
                        HR Team
                    </li>
                </ol>
                <div>
                    <button>+ Create Team</button>
                </div>
                <div className="flex flex-col  space-y-8 flex-grow items-start justify-end">
                    <button className="hover:text-slate-400 text-[35px] text-stone-400">
                        Account
                    </button>
                    <button className="hover:text-slate-400 text-[35px] text-stone-400 ">
                        Settings
                    </button>

                    <div className="text-[50px]">Pigeon.</div>
                </div>
            </div>
            <div className=" h-screen flex items-end flex-grow p-5 justify-between flex-col">
                <div className="flex-col  w-full flex-grow text-slate-300 space-y-4">
                    {MESSAGES.map((message) => (
                        <div
                            className={
                                message.sentFrom === 'Jalil'
                                    ? 'flex flex-col items-end'
                                    : 'flex flex-col items-start'
                            }
                        >
                            <div className="text-sky-900 ml-3 mr-3 text-[16px] font-semibold">
                                {message.sentFrom}
                            </div>
                            <div className="p-3 max-w-1/2 h-auto bg-stone-800 rounded-2xl flex flex-col">
                                <div>{message.content}</div>
                            </div>
                            <div className="ml-3 font-semibold font-noto text-stone-600 text-[12px]">
                                5.45pm 21-10-2023
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-stone-800 w-full h-[50px] rounded-2xl">
                    <label>send message</label>
                    <input />
                </div>
            </div>
        </div>
    )
}

export default HomePage
