import React, { useState } from 'react'
import { chatIcon } from '../assets';

const ChatBar = ()=>{ 
    return (
      <div className='w-full mx-2'>
          <div className='flex justify-between'>
              <div className='flex'>
                <span>User</span>
                 <h5>Username</h5>
              </div>
              <div className='flex'>
                  <span>Mic</span>
              </div>
          </div>
      </div>
    )
}

const ChatArea = () => {

  const [chatOpen,updateChatOpen] = useState<boolean>(false);
  if(!chatOpen)
      return <img src={chatIcon} height={80} width={80} className='cursor-pointer'  onClick={()=>updateChatOpen(true)} />
  return (
    <div className='min-h-96  min-w-96 w-4/12' style={{color:'white'}}>
        <div className='flex justify-between'>
            <h1 className='text-2xl font-mono text-green-400'>Users</h1>
            <span className='text-white cursor-pointer' onClick={()=>updateChatOpen(false)}>X</span>
        </div>
        <div className='chat-area'>
          <ChatBar />
        </div>
        <div className='chat-section'>
          
        </div>

    </div>
  )
}

export default ChatArea
