import LoginInput from './LoginInput'
function SignupForm() {
    return (
        <form className="space-y-8">
            <div className="flex space-x-8">
                <LoginInput label="First Name" />
                <LoginInput label="Last Name" />
            </div>
            <LoginInput label="Email" />
            <LoginInput label="Password" type="password" />{' '}
            <LoginInput label="Password Confirm" type="password" />
        </form>
    )
}

export default SignupForm
