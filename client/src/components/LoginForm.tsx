import LoginInput from './LoginInput'

function LoginForm() {
    return (
        <form className="space-y-8">
            <LoginInput label="Email" />
            <LoginInput label="Password" type="password" />{' '}
        </form>
    )
}

export default LoginForm
