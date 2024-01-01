import LoginInput from './LoginInput'
import { Form } from 'react-router-dom'

function LoginForm() {
    return (
        <Form method='post' className="md:space-y-8 lg:space-y-8 space-y-4">
            <LoginInput label="Email" />
            <LoginInput label="Password" type="password" />{' '}
        </Form>
    )
}

export default LoginForm
