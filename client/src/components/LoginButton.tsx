import { Link } from 'react-router-dom'

interface props {
    type?: any
    buttonText: string
}

function LoginButton({ type = 'button', buttonText }: props) {
    let styles =
        'overflow-hidden group flex justify-center items-center relative  cursor-pointer'
    let otherStyles =
        styles +
        ' relative text-[25px] text-sky-600 justify-center flex items-center rounded-2xl bg-stone-700 h-[65px] w-full flex flex-col '

    return (
        <button type={type} className={otherStyles}>
            {buttonText}
            <div className=" absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        </button>
    )
}
export default LoginButton
