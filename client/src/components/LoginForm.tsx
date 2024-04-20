import LoginInput from './LoginInput'
import { Form, useActionData } from 'react-router-dom'
import LoginButton from './LoginButton'

function LoginForm() {
    return (
        <Form method="post" className="md:space-y-8 lg:space-y-8 space-y-4">
            <LoginInput name="email" label="Email" />
            <LoginInput name="password" label="Password" type="password" />{' '}
            <LoginButton buttonText="Login" type="submit" />
        </Form>
    )
}

export default LoginForm
