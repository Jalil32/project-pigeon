import axios from 'axios'
import { redirect } from 'react-router-dom'

export const validateUser = async () => {
    try {
        const response = await axios.get('/api/v1/user/validateUser')
        if (response.status !== 200) {
            redirect('/auth')
        }
        return null
    } catch (error) {
        console.error('Error fetching data:', error)
        return redirect('/auth')
    }
}
