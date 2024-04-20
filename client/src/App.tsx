import './styles/groupChat.css'
import LoginPage, { action as authAction } from './pages/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Workspace from './pages/Workspace'
import { validateUser } from './util/auth'
import Chat from './chat'
import Settings from '@mui/icons-material/Settings'
import WorkspaceSelect from './pages/WorkspaceSelect'
import GroupSettings from './components/GroupSettings'

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <LoginPage />,
        action: authAction, // Assuming this is defined for handling auth actions
    },
    {
        path: '/',
        element: <WorkspaceSelect />,
        loader: validateUser,
    },
    {
        path: '/workspace',
        element: <Workspace />,
        loader: validateUser, // Assuming this is defined to validate the user
        children: [
            // Corrected: This route now effectively represents '/workspace/:workspaceId'
            {
                path: ':workspaceId',
                element: <Workspace />,
                children: [
                    // Corrected: This nested route now represents '/workspace/:workspaceId/team/:teamId'
                    // Assuming you meant to have ':teamId' as a dynamic segment, not 'teamId' literally
                    {
                        path: 'team/:teamId',
                        element: <Chat />,
                        children: [{ path: 'groupsettings', element: <GroupSettings /> }],
                    },
                    { path: 'settings', element: <Settings /> },
                ],
            },
        ],
    },
])
function App() {
    return <RouterProvider router={router}></RouterProvider>
}

export default App
