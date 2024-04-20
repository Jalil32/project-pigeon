import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { warn } from 'console'

function ChatPage() {
    const params = useParams()

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/user')
            .then((response) => {
                console.log(response.body)
                return response.json()
            })
            .then((resData: any) => {
                console.log('it worked')
                console.log(resData.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    return (
        <>
            <h1>Chat Page</h1>
            <p>{params.chatId}</p>
        </>
    )
}

export default ChatPage
