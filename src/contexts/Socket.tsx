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
type peerJoinsProp = {
  peerID: string;
};

export const SocketContextWrapper = ({
  children,
}: socketContextWrapperProps) => {
  const [socket, updateSocket] = useState<Socket | null>(null);
  const localStream = useRef<MediaStream>();
  const [users] = useState(); //it will store all the users socketids.. and

  const peers = useRef<Map<string,DataConnection>>(new Map());
  const peersMedia = useRef<Map<string,HTMLAudioElement>>(new Map())
  const myPeer = useRef<Peer>();

  useEffect(() => {
    console.log("sendiing the sockets request to the socket  io server ..... ");
    updateSocket(io("http://localhost:8080")); // for the testing purpose...

    (async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (e) {
        console.log("userResponse ");
      }
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("fetchPlayers", () => {
        console.log("players fetched ...");
      });
      console.log("socketid", socket);
      socket.on("connect", () => {
        console.log("Socket connected, id:", socket.id);
        if (socket.id) {
          myPeer.current = new Peer(socket.id); //  Create a Peer with socketId as its unique identifier
          // here we need to send an error to the user if its peerconcetion got rejected .

          myPeer.current?.addListener("open", (id) => {
            console.log(
              "Connection has been opened! of my peer sending my availability to otherss..",
              id
            );
            socket.emit("registerMe", { peerID: id });
          });
          myPeer.current.addListener("connection", handleConnection);

          myPeer.current.on("call", (call) => {
            console.log("Incoming media call from", call.peer);
            if (localStream.current) {
              call.answer(localStream.current); // Send the local audio stream
              call.on("stream", (remoteStream) => {
                console.log("Received remote audio stream from", call.peer);
                handleRemoteStream(remoteStream,call.peer);
              });
              call.on("close", () => {
                console.log("Media call closed with", call.peer);
                peersMedia.current?.delete(call.peer);
              })            }
          });
        }

        socket.on("someone-joins", handleSomeoneJoins);
      });
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
      socket?.off("someone-joins", handleSomeoneJoins);
      myPeer.current?.off("connection",handleConnection);
    };
  }, [socket]);

  type peerJoinsProp = {
    peerID: string;
  };
  const handleConnection = (connection: DataConnection) => {
    console.log("connection request coming from", connection.peer);
    connection.on("open", () => {
      console.log("Connection opened with peer", connection.peer);
      if (peers.current) peers.current.set(connection.peer,connection);
      connection.send("Hi, I'm your new friend!");
    });

    connection.on("data", (data) => {
      console.log("Received data from peer:", data);
    });
    connection.on("close", () => {
      console.log("Connection closed with peer", connection.peer);
    });

    console.log(
      "device which is connected with has the connection",
      connection
    );
    console.log("sending the data to the connection");
  };

  const handleRemoteStream = (remoteStream: MediaStream,peerId:string) => {

    if(!remoteStream){
      return;
    }
    const audio = new Audio();
    peersMedia.current.set(peerId,audio)
    audio.srcObject = remoteStream;
    
    console.log("stream coming up i thinkkk ??",audio,remoteStream);
    audio
      .play()
      .catch((err) => console.error("Error playing remote audio:", err));

    console.log('peermedia of the peer ',peerId,peersMedia)
  };

  const handleSomeoneJoins = (peerID: string) => {
    console.log("peer joins with peerId ", peerID);
    const connectionToSomeone = myPeer.current?.connect(peerID);
    if (connectionToSomeone) {
      connectionToSomeone.on("open", () => {
        console.log("Connection established with peer ", peerID);
        // You can now start sending data or setting up media streams
      });

      connectionToSomeone.on("data", (data) => {
        console.log("Received data from peer:", data);
      });

      connectionToSomeone.on("close", () => {
        console.log("Connection closed with peer", peerID);
      });

      let call: MediaConnection | undefined;
      if (myPeer.current && localStream.current)
        call = myPeer.current.call(peerID, localStream.current);

      if (call) {
        call.on("stream", (remoteStream) => {
          console.log("Received remote stream from", peerID);
          handleRemoteStream(remoteStream,peerID);
          setTimeout(() => {
              console.log('timeout has been executed....')
              mutePlayer(peerID)
          }, 5000);
        });
 
        call.on("close", () => {
          console.log("Media call closed with", peerID);
          peersMedia.current?.delete(peerID);
        });

        // Store the peer connection
        if (peers.current) peers.current.set(peerID, connectionToSomeone);
      }
    }
  };
  const mutePlayer = (peerId:string)=>{
      let peerMediaStream = peersMedia.current.get(peerId)
      if(peerMediaStream)
      peerMediaStream.muted = true
     
  }
  const handleMessageRequest = () => {};
  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        socketId: "",
        noOfPlayers: 0,
        players: [],
        messages: [],
        fetchCurrentUsersInTheLobby: /* fetchCurrentUsersInTheLobby */ () => 0,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

//createContext
