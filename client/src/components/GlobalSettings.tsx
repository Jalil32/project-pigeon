import { useNavigate, useParams } from 'react-router-dom'

function GlobalSettings() {
    const navigate = useNavigate()
    const params = useParams()

    function handleClick() {
        navigate(`${params.workspaceId}/settings`)
    }

    return (
        <div className="flex flex-col mt-8  space-y-8  items-start justify-end">
            <button className="hover:text-slate-400 text-[35px] text-stone-400">Account</button>
            <button onClick={handleClick} className="hover:text-slate-400 text-[35px] text-stone-400 ">
                Settings
            </button>

            <div className="text-[50px]">Pigeon.</div>
        </div>
    )
}

export default GlobalSettings
