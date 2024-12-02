import { createContext } from "react";

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
//createContext
