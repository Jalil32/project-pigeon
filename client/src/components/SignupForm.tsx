import LoginInput from './LoginInput'
import { Form } from 'react-router-dom'

function SignupForm() {
    return (
        <Form method='post' className="md:space-y-8 lg:space-y-8 space-y-4">
            <div className="flex md:space-x-8 lg:space-x-8 space-x-4">
                <LoginInput label="First Name" />
                <LoginInput label="Last Name" />
            </div>
            <LoginInput label="Email" />
            <LoginInput label="Password" type="password" />{' '}
            <LoginInput label="Password Confirm" type="password" />
        </Form>
    )
}

export default SignupForm
