import SignupForm from '../components/SignupForm'
import { Link, redirect, useActionData, useSearchParams } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { json } from 'react-router-dom'

interface authData {
    email: string
    password: string
    passwordConfirm?: string
    firstName?: string
    lastName?: string
    passwordChangedAt?: number
}

function LoginPage() {
    const data: any = useActionData()

    const [searchParams, _setSearchParams] = useSearchParams('mode')
    const isLogin = searchParams.get('mode') === 'login'
    const token = searchParams.get('inviteToken')
    const isInvite = searchParams.get('inviteToken') !== null

    return (
        <div className="bg-gradient-to-tr from-green-400 to-cyan-600 flex w-screen h-screen items-center justify-center">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl lg:rounded-[55px] sm:rounded-[55px] rounded-t-[55px] bg-stone-800 h-auto self-end md:self-center sm:min-h-[850px] lg:w-[550px] sm:w-[550px] w-full">
                <div className="lg:text-[35px] md:text-[30px] sm:text-[30px] text-stone-400">Pigeon</div>
                {isLogin && (
                    <div className="lg:text-[60px] md:text-[40px] sm:text-[20px] ">
                        Enter <br /> Your Details
                    </div>
                )}
                {!isLogin && (
                    <div className=" md:text-[60px] text-[30px]">
                        Create <br /> New Account
                    </div>
                )}
                <div className=" text-stone-400 lg:text-[20px] md:text-[15px]">
                    {isLogin ? 'Dont have an account? ' : 'Already a member? '}
                    <Link
                        to={`?mode=${isLogin ? 'signup' : 'login'}${isInvite ? '&inviteToken=' + token : ''}`}
                        className="text-sky-600 "
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </Link>
                </div>
                {isLogin && <LoginForm />}
                {!isLogin && <SignupForm />}

                {data && <div className="text-red-400">{data.message}</div>}
            </div>
        </div>
    )
}

export default LoginPage

export async function action({ request }: any) {
    const searchParams = new URL(request.url).searchParams
    const mode = searchParams.get('mode') || 'login'
    const isInvite = searchParams.get('inviteToken') !== null
    const inviteToken = searchParams.get('inviteToken')

    if (mode !== 'login' && mode !== 'signup') {
        throw json({ message: 'Unsupported mode.' }, { status: 422 })
    }

    const data = await request.formData()

    const authData: authData = {
        email: data.get('email'),
        password: data.get('password'),
    }

    if (mode === 'signup') {
        authData.firstName = data.get('firstName')
        authData.lastName = data.get('lastName')
        authData.passwordConfirm = data.get('passwordConfirm')
        authData.passwordChangedAt = Date.now()
    }

    const response: any = await fetch('/api/v1/user/' + mode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
    })

    // 400 for bad request
    // 401 for unauthorised
    if (response.status === 400 || response.status === 401) {
        return response
    }

    if (!response.ok) {
        throw json({ message: 'Could not authenticate user.' }, { status: 500 })
    }

    // soon: manage that token
    // store user
    const resData = await response.json()
    const user = resData.data.user

    // store user in browser storage for now
    localStorage.setItem('user', JSON.stringify(user))

    if (isInvite) {
        // tell node rest api to add him to the workspace
        const workspaceResponse: any = await fetch(`/api/v1/workspace/${user._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: inviteToken,
            }),
        })

        const workspaceData = await workspaceResponse.json()

        console.log(workspaceData)

        // redirect to the new workspace
        redirect(`/workspace/${workspaceData.data.workspaceId}`)
    }

    return redirect('/workspace')
}
