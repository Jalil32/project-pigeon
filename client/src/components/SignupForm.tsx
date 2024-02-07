import LoginInput from './LoginInput'
import { Form } from 'react-router-dom'
import LoginButton from './LoginButton'
function SignupForm() {
    return (
        <Form method="post" className="md:space-y-8 lg:space-y-8 space-y-4">
            <div className="flex md:space-x-8 lg:space-x-8 space-x-4">
                <LoginInput name="firstName" label="First Name" />
                <LoginInput name="lastName" label="Last Name" />
            </div>
            <LoginInput name="email" label="Email" />
            <LoginInput name="password" label="Password" type="password" />{' '}
            <LoginInput
                name="passwordConfirm"
                label="Password Confirm"
                type="password"
            />
            <LoginButton buttonText="Signup" type="submit" />
        </Form>
    )
}

export default SignupForm
