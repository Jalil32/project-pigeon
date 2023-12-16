import './styles/groupChat.css'
import LoginPage from './pages/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RootLayout from './pages/Root'

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <LoginPage />,
    },
    {
        path: '/chat',
        element: <HomePage />,
    },
])

function App() {
    return <RouterProvider router={router}></RouterProvider>
}

export default App
