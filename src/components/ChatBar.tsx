import React, { useEffect, useState } from 'react'


const UserSection = () =>{
    const [users] = useState('')
    
    useEffect(()=>{
        
    },[])

    return(
        <div>
            User section 
        </div>
    )
}
const GlobalSection = ()=>{
        return (<div>Global section .....</div>)
}


const ChatBar = () => {
    const [section,updateSection] = useState<"user"|"global">("user")

  return (
    <div className='bg-white border'>
        <div className='flex justify-evenly'>
        <button className={`${section=='user' && "border-b-2 border-black"} `}
        onClick={()=>{
            updateSection("user")
        }}>Users</button>
        <button className={`${section=='global' && "border-b-2 border-black"}`} onClick={()=>{
            updateSection("global")
        }}>Global</button>
        </div>

        <div id='chatbar-area'  className='md:max-h-[90vh] overflow-y-auto overflow-x-hidden max-h-[70vh] '>
            {section == "user"?<UserSection/>:<GlobalSection />}
        </div>
    </div>


  )
}

export default ChatBar
