import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import Peer, { MediaConnection } from "peerjs";
import { DataConnection } from "peerjs";
import { io, Socket } from "socket.io-client";
import { Mesh } from "three";

type Message = {
  from: string;
  content: string;
};



type socketContextProps<M> = {
  socket: Socket | null;
  socketId: string;
  noOfPlayers: number;
  playersMedia: React.MutableRefObject<Map<string, {audio:HTMLAudioElement|null,mutes:boolean}>>|undefined;
  myPlayerRef:React.RefObject<Mesh>;
  peersState: peersState[];
  fetchCurrentUsersInTheLobby: () => void;
  messages: M[];
  color: 'yellow' | 'brown' | 'gray';
};

export const SocketContext = createContext<
  socketContextProps<Message>
>({
  socket: null,
  socketId: "",
  noOfPlayers: 0,
  playersMedia:undefined,
  myPlayerRef: React.createRef<Mesh>(),
  messages: [],
  peersState:[],
  fetchCurrentUsersInTheLobby: () => "",
  color:"brown",
});

type socketContextWrapperProps = {
  children: ReactNode,
  userName:string
  colorCode:number
};

interface peersState{
  peerId:string,
  color: 'yellow' | 'brown' | 'gray';
  peerName:string
  position:[number,number,number]
}
const colors:('yellow' | 'brown' | 'gray')[]= ['yellow', 'brown', 'gray'];
  
export const SocketContextWrapper = ({
  children,
  userName,
  colorCode
}: socketContextWrapperProps) => {
  const [socket, updateSocket] = useState<Socket | null>(null);
  const localStream = useRef<MediaStream>();
  const myPlayerRef = useRef<Mesh>(null);
  const [error,updateError] = useState<string>("")
  const peers = useRef<Map<string, DataConnection>>(new Map()); 
  const [peersState,updatePeersState] = useState<peersState[]>([]) //creating a new state variable which will holds the current players in the lobby.
  const peersMedia = useRef<Map<string, {audio:HTMLAudioElement|null,mutes:boolean}>>(new Map());
  const myPeer = useRef<Peer>();
  const [color] = useState<'yellow' | 'brown' | 'gray'>(colors[colorCode])

  useEffect(() => {
    
    updateSocket(io("https://metaverse3d-backend.onrender.com"));

    (async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (e) {
       /*  updateError("Please give microPhone access!") */
      }
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      
      socket.on("connect", () => {
        
        if (socket.id) {
          myPeer.current = new Peer(socket.id, {
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" }, // STUN server only
              ],
            },
          }); // Create a Peer with socketId as its unique identifier
          // here we need to send an error to the user if its peerconcetion got rejected .

  
          myPeer.current?.addListener("open", (id) => {
            
            socket.emit("registerMe", { peerID: id });
            console.log("client got the public ip.")
          });
          myPeer.current.addListener("connection", handleConnection);
   
          myPeer.current.on("error",(error:any)=>{
            console.log("error  while getting the peerId",error);
            updateError("We couldn't able to connect you to the Internet!");
        })

          myPeer.current.on("call", (call) => {
            
            if (localStream.current) {
              call.answer(localStream.current); // Send the local audio stream
              call.on("stream", (remoteStream) => {
                
                handleRemoteStream(remoteStream, call.peer);
              });
              call.on("close", () => {
                
                peersMedia.current?.delete(call.peer);
              });

              call.on("error",()=>{
                console.log("error happening on call.");
              })
            }
          });
        }
        console.log("socket listeneres....")
        socket.on("someone-leaves", handleSomeOneLeaves);
        socket.on("someone-joins", handleSomeoneJoins);
        socket?.on("messageRequest", handleMessageRequest);
      });


    }
    return () => {
      console.log("turning off the listneres");
      socket?.off("connect");
      socket?.off("messageRequest", handleMessageRequest);
      socket?.off("someone-leaves", handleSomeOneLeaves);
      socket?.off("someone-joins", handleSomeoneJoins);
      myPeer.current?.off("connection", handleConnection);
      myPeer.current?.off("call")
      myPeer.current?.off("open")

    };
  }, [socket]);

  const handleSomeOneLeaves = (socketId: string) => {
    if (peers.current.has(socketId)) {
      
      const disconnected_peer = peers.current.get(socketId);
      try {
        disconnected_peer?.close({ flush: true });
      } catch (error) {
        console.error(
          `Failed to close peer connection for ${socketId}:`,
          error
        );
      }
      peers.current.delete(socketId);
    }
    if(peersMedia.current.has(socketId)){
      peersMedia.current.delete(socketId)
    }
    
   updatePeersState((prevArray) => prevArray.filter((item) => item.peerId !== socketId));

  };
  const handleConnection = (connection: DataConnection) => {
    
    // when the new socket/player joins then we have to get all the player's coordinates who are
    // available in the lobby.
    console.log("im the new player and reciving the connection reequest!")
    connection.on("open", () => {
      peers.current.set(connection.peer, connection);
      connection.send({name:userName,color:colors[colorCode]})

    });

    connection.on("data", (data) => {
      const position = data as {name:string,color: 'yellow' | 'brown' | 'gray', position:[x:number,y:number,z:number]}
      updatePeersState((prevArray) => [...prevArray, {peerId:connection.peer,peerName:position.name,color:position.color, position:position.position}]);
    });
    connection.on("close", () => {
      
      peers.current.delete(connection.peer)
      updatePeersState((prevArray) => prevArray.filter((item) => item.peerId !== connection.peer));
    });

    connection.on("error",(error:any)=>{
      console.log("something went wrong when connecting to the peer!",error);
    })
    
    
  };

  const handleRemoteStream = (remoteStream: MediaStream, peerId: string) => {
    if (!remoteStream) {
      peersMedia.current.set(peerId, {audio:null,mutes:false});
      return;
    }
    const audio = new Audio();
    try{
    audio.srcObject = remoteStream;
    peersMedia.current.set(peerId, {audio:audio,mutes:false});

    }
    catch(err){
      peersMedia.current.set(peerId, {audio:null,mutes:false});

    }
    
    /*     audio
      .play()
      .catch((err) => console.error("Error playing remote audio:", err));
 */
    
  };

  const handleSomeoneJoins = (peerID: string) => {
    
    const connectionToSomeone = myPeer.current?.connect(peerID);
    console.log("someone joins with the socket id:",peerID);
      connectionToSomeone?.on("error",(error:any)=>{
        console.log("couldn't connect with the new joiny! \n reason:",error)
      })
      connectionToSomeone?.on("open", () => {
        peers.current.set(peerID, connectionToSomeone);
        
        connectionToSomeone.send({
          color:colors[colorCode],
          name :userName,
          position:
          myPlayerRef.current?[...myPlayerRef.current.position]:[0,0.3,0]});
      });
      connectionToSomeone?.on("data", (data) => {
        
        const playerName = data as {name:string,color: 'yellow' | 'brown' | 'gray';}
        
        updatePeersState((prevArray) => [...prevArray,{peerId:peerID,peerName:playerName.name,color:playerName.color,position:[0,0.3,0]}]);

      });
      connectionToSomeone?.on("close", () => {
        
        connectionToSomeone.off("open");
        peers.current.delete(peerID)
        updatePeersState((prevArray) => prevArray.filter((item) => item.peerId !== peerID));
      });

      //sending our voice media to the new coming!
      let call: MediaConnection | undefined;
      if (myPeer.current && localStream.current)
        call = myPeer.current.call(peerID, localStream.current);

      if (call) {
        call.on("stream", (remoteStream) => {
          
          handleRemoteStream(remoteStream, peerID);
        });

        call.on("close", () => {
          
          peersMedia.current?.delete(peerID);
        });

      }
    
  };
  const handleMessageRequest = () => {};
  return (
    <>
    {error?<div className="h-svh w-full text-white flex flex-col items-center justify-center bg-zinc-900">
        <h1 className="font-extrabold md:text-5xl text-2xl font-mono -rotate-3 text-white pl-5">Error:{error}</h1>
        <p className="font-mono my-3 pl-5">make sure you've given the mic permission!</p>
        <p className="font-mono my-8 cursor-pointer underline" onClick={()=>window.location.reload()
}>click here to refresh </p>

    </div>:
      <SocketContext.Provider
      value={{
        color:color,
        socket: socket,
        socketId: "",
        noOfPlayers: 0,
        playersMedia: peersMedia,
        myPlayerRef,
        messages: [],
        peersState,
        fetchCurrentUsersInTheLobby: /* fetchCurrentUsersInTheLobby */ () => 0,
      }}
    >
      {children}
    </SocketContext.Provider>
    }
    </>
  );
};

//createContext