import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import Peer from "peerjs";
import { io, Socket } from "socket.io-client";

type Message = {
  from: string;
  content: string;
};

type Players = {
  socketId: string;
  x: number;
  y: number;
  z: number;
};

type socketContextProps<P, M> = {
  socket: Socket | null;
  socketId: string;
  noOfPlayers: number;
  players: P[];
  fetchCurrentUsersInTheLobby: () => void;
  messages: M[];
};

export const SocketContext = createContext<
  socketContextProps<Players, Message>
>({
  socket: null,
  socketId: "",
  noOfPlayers: 0,
  players: [],
  messages: [],
  fetchCurrentUsersInTheLobby: () => "",
});

type socketContextWrapperProps = {
  children: ReactNode;
};

export const SocketContextWrapper = ({
  children,
}: socketContextWrapperProps) => {
  const [socket, updateSocket] = useState<Socket | null>(null);

  const [users] = useState(); //it will store all the users socketids.. and

  const peers=useRef<{socketId:Peer}>() 
  const myPeer = useRef<Peer>()

  useEffect(() => {
    console.log("sendiing the sockets request to the socket  io server ..... ");
    updateSocket(io("http://localhost:8080")); // for the testing purpose...
  
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("fetchPlayers", () => {
        console.log("players fetched ...");
      });

      if(socket.id)
      myPeer.current = new Peer(socket.id) //create a Peer with socketId as its unique identifier

      // will create a offer regarding the current specification my
      // device supports. but we need to create an offer everytime for each socket/user.

      console.log("testing the Onmessage event ... ");
      socket.emit("onMessage", "message123 provided by the client");

      // here we have to register all the sockets listners...

      socket?.on("messageRequest", handleMessageRequest); // for handling the message request or we can say the message
      // sent by the friend..  this event will recieve that message.

    

    }
    return () => {
      socket?.off("messageRequest", handleMessageRequest);
    };
  }, [socket]);
    
  
 

  const handleMessageRequest = () => {};
  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        socketId: "",
        noOfPlayers: 0,
        players: [],
        messages: [],
        fetchCurrentUsersInTheLobby: /* fetchCurrentUsersInTheLobby */ ()=>0,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

//createContext
