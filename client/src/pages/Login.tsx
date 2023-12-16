import SignupForm from '../components/SignupForm'
import LoginButton from '../components/LoginButton'
import { Form, Link, useSearchParams } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
    const [searchParams, setSearchParams] = useSearchParams('mode')
    const isLogin = searchParams.get('mode') === 'login'

    return (
        <div className="bg-gradient-to-tr from-green-400 to-cyan-600 flex w-screen h-screen items-center justify-center">
            <div className=" space-y-8 text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl rounded-[55px] bg-stone-800 h-2/3 w-[500px] ">
                <div className="text-[35px] text-stone-400">Pigeon</div>
                {isLogin && (
                    <div className="text-[60px]">
                        Enter <br /> Your Details
                    </div>
                )}
                {!isLogin && (
                    <div className="text-[60px]">
                        Create <br /> New Account
                    </div>
                )}
                <div className=" text-stone-400 text-[20px]">
                    {isLogin ? 'Dont have an account? ' : 'Already a member? '}
                    <Link
                        to={`?mode=${isLogin ? 'signup' : 'login'}`}
                        className="text-sky-600 "
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </Link>
                </div>
                {isLogin && <LoginForm />}
                {!isLogin && <SignupForm />}
                <LoginButton buttonText={isLogin ? 'Login' : 'Signup'} />
            </div>
        </div>
    )
}

export default LoginPage
