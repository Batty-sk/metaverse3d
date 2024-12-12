import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketContextWrapper } from './contexts/Socket.tsx'

createRoot(document.getElementById('root')!).render(
    <SocketContextWrapper>
    <App />
    </SocketContextWrapper>
)
