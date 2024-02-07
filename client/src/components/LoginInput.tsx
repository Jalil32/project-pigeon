interface LoginProps {
    name: string
    label: string
    defaultText?: string
    type?: string
}

function LoginInput({
    name,
    label,
    defaultText = '',
    type = 'text',
}: LoginProps) {
    return (
        <div className="relative rounded-2xl bg-stone-700 lg:h-[65px] md:h-[65px] h-[50px] w-full flex flex-col border-0 border-transparent hover:border-sky-600 focus:bg-red-500">
            <label
                htmlFor={name}
                className="text-stone-400 mt-2 ps-4 lg:text-sm md:text-sm text-[10px] border-transparent"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                autoComplete="on"
                className="pt-2 border-4 border-transparent outline-none focus:border-sky-600 h-full w-full absolute   ps-3 rounded-2xl text-md appearance-none bg-transparent "
                type={type}
                defaultValue={defaultText}
            />
        </div>
    )
}

export default LoginInput
