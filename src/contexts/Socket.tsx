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
  someoneJoinsOrLeave: [boolean, string] | undefined;
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
  someoneJoinsOrLeave: undefined,
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
  const [someoneJoinsOrLeave, setSomeOneJoinsOrLeave] = useState<
    [boolean, string] | undefined
  >();
  const peers = useRef<Map<string, DataConnection>>(new Map());
  const peersMedia = useRef<Map<string, HTMLAudioElement>>(new Map());
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
          myPeer.current = new Peer(socket.id); // Create a Peer with socketId as its unique identifier
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
                handleRemoteStream(remoteStream, call.peer);
              });
              call.on("close", () => {
                console.log("Media call closed with", call.peer);
                peersMedia.current?.delete(call.peer);
              });
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
      socket?.off("someone-joins", handleSomeoneJoins);
      myPeer.current?.off("connection", handleConnection);
    };
  }, [socket]);

  const handleSomeOneLeaves = (socketId: string) => {
    if (peers.current.has(socketId)) {
      console.log("removing the disconnected peer from the current storage..");
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
    
    setSomeOneJoinsOrLeave([false,socketId])

  };

  const handleConnection = (connection: DataConnection) => {
    console.log("connection request coming from", connection.peer);
    // when the new socket/player joins then we have to get all the player's coordinates who are
    // available in the lobby.
    setSomeOneJoinsOrLeave([true, connection.peer]);
    connection.on("open", () => {
      console.log("Connection opened with peer", connection.peer);
      if (peers.current) peers.current.set(connection.peer, connection);
      connection.send("Hi, I'm your new friend!");
    });

    connection.on("data", (data) => {
      console.log("Received data from peer:", data);
    });
    connection.on("close", () => {
      console.log("Connection closed with peer", connection.peer);
      setSomeOneJoinsOrLeave([false, connection.peer]);
    });

    console.log(
      "device which is connected with has the connection",
      connection
    );
    console.log("sending the data to the connection");
  };

  const handleRemoteStream = (remoteStream: MediaStream, peerId: string) => {
    if (!remoteStream) {
      return;
    }
    const audio = new Audio();
    peersMedia.current.set(peerId, audio);
    audio.srcObject = remoteStream;

    console.log("stream coming up i thinkkk ??", audio, remoteStream);
    /*     audio
      .play()
      .catch((err) => console.error("Error playing remote audio:", err));
 */
    console.log("peermedia of the peer ", peerId, peersMedia);
  };

  const handleSomeoneJoins = (peerID: string) => {
    console.log("peer joins with peerId ", peerID);
    const connectionToSomeone = myPeer.current?.connect(peerID);
    if (connectionToSomeone) {
      connectionToSomeone.on("open", () => {
        console.log("Connection established with peer ", peerID);
        // You can now start sending data or setting up media streams
        setSomeOneJoinsOrLeave([true, peerID]);
      });

      connectionToSomeone.on("data", (data) => {
        console.log("Received data from peer:", data);
      });

      connectionToSomeone.on("close", () => {
        console.log("Connection closed with peer", peerID);
        connectionToSomeone.off("open");
        setSomeOneJoinsOrLeave([false, peerID]);
      });

      //sending our voice media to the new coming!
      let call: MediaConnection | undefined;
      if (myPeer.current && localStream.current)
        call = myPeer.current.call(peerID, localStream.current);

      if (call) {
        call.on("stream", (remoteStream) => {
          console.log("Received remote stream from", peerID);
          handleRemoteStream(remoteStream, peerID);
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
  const mutePlayer = (peerId: string) => {
    let peerMediaStream = peersMedia.current.get(peerId);
    if (peerMediaStream) peerMediaStream.muted = true;
  };
  const handleMessageRequest = () => {};
  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        socketId: "",
        noOfPlayers: 0,
        players: [],
        messages: [],
        someoneJoinsOrLeave,
        fetchCurrentUsersInTheLobby: /* fetchCurrentUsersInTheLobby */ () => 0,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

//createContext
