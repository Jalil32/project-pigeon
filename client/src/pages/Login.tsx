import SignupForm from '../components/SignupForm'
import LoginButton from '../components/LoginButton'
import { Form, Link, useSearchParams } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
    const [searchParams, _setSearchParams] = useSearchParams('mode')
    const isLogin = searchParams.get('mode') === 'login'

    return (
        <div className="bg-gradient-to-tr from-green-400 to-cyan-600 flex w-screen h-screen items-center justify-center">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 text-slate-300 leading-none font-noto font-bold p-14 shadow-2xl lg:rounded-[55px] sm:rounded-[55px] rounded-t-[55px] bg-stone-800 h-auto self-end md:self-center sm:h-[850px] lg:w-[550px] sm:w-[550px] w-full">
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

export async function action({request}: any) {
	const searchParams = new URL(request.url).searchParams
	const isLogin = searchParams.get('mode') === 'login'

	const data = await request.formData();

	const authData = {
		email: data.get('email'),
		password: data.get('password')
	}



}
