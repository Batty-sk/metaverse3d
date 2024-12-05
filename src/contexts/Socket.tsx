import React, { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";


type Message={
    from:string,
    content:string
}

type Players = {
  socketId: string;
  distance: number;
};

type socketContextProps<P,M> = {
  socketId: string;
  noOfPlayers: number;
  players: P[];
  
  messages:M[]
};

const SocketContext = createContext<socketContextProps<Players,Message>>({ socketId: "",noOfPlayers:0,players:[],messages:[]});


export const SocketContextWrapper = (children:React.ReactNode)=>{
    const [socket,updateSocket] = useState<Socket|null>(null)
    
    useEffect(()=>{
      updateSocket(io('http://localhost:8080')) // for the testing purpose...
    },[])

    useEffect(()=>{
        if(socket)
        {
          socket.emit('fetchPlayers',()=>{
            console.log('players fetched ...')
          })

        }

        socket?.on("friendRequest",handleFriendRequest) // for handling the friend request sent by some random dude/girl

        socket?.on("messageRequest",handleMessageRequest) // for handling the message request or we can say the message
        // sent by the friend..  this event will recieve that message.

        return()=>{
          socket?.off("friendRequest",handleFriendRequest)
          socket?.off("messageRequest",handleMessageRequest)
        }

    },[socket])
    const handleFriendRequest = ()=>{

    }
    const handleMessageRequest=()=>{

    }

    return(
      <SocketContext.Provider value={{socketId:'',noOfPlayers:0,players:[],messages:[]}}>
        </SocketContext.Provider> 
    )
}


//createContext
