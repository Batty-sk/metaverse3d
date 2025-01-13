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
import { Mesh, Vector3 } from "three";

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
  playersMedia: React.MutableRefObject<Map<string, HTMLAudioElement>>|undefined;
  myPlayerRef:React.RefObject<Mesh>;
  peersState: peersState[];
  fetchCurrentUsersInTheLobby: () => void;
  messages: M[];
};

export const SocketContext = createContext<
  socketContextProps<Players, Message>
>({
  socket: null,
  socketId: "",
  noOfPlayers: 0,
  playersMedia:undefined,
  myPlayerRef: React.createRef<Mesh>(),
  messages: [],
  peersState:[],
  fetchCurrentUsersInTheLobby: () => "",
});

type socketContextWrapperProps = {
  children: ReactNode,
  userName:string
};

interface peersState{
  peerId:string,
  peerName:string
  position:[number,number,number]
}

export const SocketContextWrapper = ({
  children,
  userName
}: socketContextWrapperProps) => {
  const [socket, updateSocket] = useState<Socket | null>(null);
  const localStream = useRef<MediaStream>();
  const myPlayerRef = useRef<Mesh>(null);
  const [error,updateError] = useState<string>("")
  const peers = useRef<Map<string, DataConnection>>(new Map()); 
  const [peersState,updatePeersState] = useState<peersState[]>([]) //creating a new state variable which will holds the current players in the lobby.
  const peersMedia = useRef<Map<string, HTMLAudioElement>>(new Map());
  const myPeer = useRef<Peer>();

  useEffect(() => {
    
    updateSocket(io("http://localhost:8080")); // for the testing purpose...

    (async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (e) {
        updateError("Please give microPhone access!")
      }
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      
      socket.on("connect", () => {
        
        if (socket.id) {
          myPeer.current = new Peer(socket.id); // Create a Peer with socketId as its unique identifier
          // here we need to send an error to the user if its peerconcetion got rejected .

          myPeer.current.on("error",(error:any)=>{
              console.log("error happening while getting the peerId");
              updateError("We couldn't able to connect you to the Internet!");
          })

          myPeer.current?.addListener("open", (id) => {
            
            socket.emit("registerMe", { peerID: id });
          });
          myPeer.current.addListener("connection", handleConnection);

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
        socket.on("someone-leaves", handleSomeOneLeaves);
        socket.on("someone-joins", handleSomeoneJoins);
        socket?.on("messageRequest", handleMessageRequest);
      });

    }
    return () => {
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
    connection.on("open", () => {
      peers.current.set(connection.peer, connection);
      connection.send(userName)

    });

    connection.on("data", (data) => {
      const position = data as {name:string, position:[x:number,y:number,z:number]}
      updatePeersState((prevArray) => [...prevArray, {peerId:connection.peer,peerName:position.name,position:position.position}]);
    });
    connection.on("close", () => {
      
      peers.current.delete(connection.peer)
      updatePeersState((prevArray) => prevArray.filter((item) => item.peerId !== connection.peer));
    });

    
    
  };

  const handleRemoteStream = (remoteStream: MediaStream, peerId: string) => {
    if (!remoteStream) {
      return;
    }
    const audio = new Audio();
    audio.srcObject = remoteStream;
    peersMedia.current.set(peerId, audio);
    
    /*     audio
      .play()
      .catch((err) => console.error("Error playing remote audio:", err));
 */
    
  };

  const handleSomeoneJoins = (peerID: string) => {
    
    const connectionToSomeone = myPeer.current?.connect(peerID);
    if (connectionToSomeone) {
      connectionToSomeone.on("open", () => {
        
        peers.current.set(peerID, connectionToSomeone);
        
        connectionToSomeone.send({
          name :userName,
          position:
          myPlayerRef.current?[...myPlayerRef.current.position]:[0,0.3,0]});
      });
      connectionToSomeone.on("data", (data) => {
        
        const playerName = data as string
        
        updatePeersState((prevArray) => [...prevArray,{peerId:peerID,peerName:playerName,position:[0,0.3,0]}]);

      });
      connectionToSomeone.on("close", () => {
        
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

        // Store the peer connection
      }
    }
  };
  const handleMessageRequest = () => {};
  return (
    <>
    {error?<div className="h-svh w-full flex items-center justify-center">
        <h1 className="font-extrabold text-5xl -rotate-3">Error:{error}</h1>
    </div>:
      <SocketContext.Provider
      value={{
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
