interface LoginProps {
    label: string
    defaultText?: string
    type?: string
}

function LoginInput({ label, defaultText = '', type = 'text' }: LoginProps) {
    return (
        <div className="relative rounded-2xl bg-stone-700 h-[65px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
            <label className="text-stone-400 mt-2 ps-4 text-sm border-transparent">
                {label}
            </label>
            <input
                className="pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl text-md appearance-none bg-transparent "
                type={type}
                defaultValue={defaultText}
            />
        </div>
    )
}

export default LoginInput
