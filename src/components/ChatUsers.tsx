import React, { useEffect, useState } from "react";
import { chatNotification, Chat } from "./ChatArea";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { muteIcon, notMutedIcon, user, send } from "../assets";

interface chatUsersProps {
  chats: Chat;
  chatNotifications: chatNotification;
  updateChatNotifications: React.Dispatch<
    React.SetStateAction<chatNotification>
  >;
}

interface chatBarProps {
  peerId: string;
  handleMicMute: (peerId: string) => boolean;
}

const ChatBar = ({ peerId, handleMicMute }: chatBarProps) => {
  const [muted, updateMuted] = useState(false);
  const handleMuteChange = () => {
    handleMicMute(peerId);
    updateMuted(!muted);
  };
  return (
    <div className="w-full  bg-[#d6ce93] p-3">
      <div className="flex justify-between">
        <div className="flex items-center cursor-pointer">
          <img src={user} height={35} width={35} alt="" />
          <h5 className="font-mono">{peerId}</h5>
        </div>
        <div className="flex">
          <span onClick={handleMuteChange} className="cursor-pointer">
            {" "}
            <img
              src={muted ? muteIcon : notMutedIcon}
              height={30}
              width={30}
              alt={muted ? "muted" : "unmuted"}
            />{" "}
          </span>
        </div>
      </div>
    </div>
  );
};
type UserAreaProp = {
  handleMessageSend: (message: string, to: string) => void;
  chats: string[];
  peerId: string;
};
const UserArea = ({ handleMessageSend,chats,peerId }: UserAreaProp) => {
  const [message, updateMessage] = useState<string>("");
  return (
    <>
      <div className="h-2/5 bg-slate-50 m-2 rounded-md"></div>
      <div className="flex justify-center items-center">
        <input
          type="text"
          name="input"
          id=""
          placeholder="Enter your message.."
          className="rounded-md outline outline-1 outline-amber-800 p-3"
          value={message}
          onChange={(e) => {
            updateMessage(e.target.value);
          }}
        />
        <span className="ms-3 cursor-pointer" onClick={()=>handleMessageSend(message,peerId)}>
          {" "}
          <img src={send} alt="" />
        </span>
      </div>
    </>
  );
};
const ChatUsers = ({
  chats,
  chatNotifications,
  updateChatNotifications,
  
}: chatUsersProps) => {
  const { peersState } = useContext(SocketContext);
  const [peerSelected, updatePeerSelected] = useState<string | false>(false);
    const { socket } = useContext(SocketContext);
  
  useEffect(() => {
   if(peerSelected != false)
   {
    
   }
  }, [peerSelected]);

  const handleMicToggle = (peerId: string) => {
    return true;
  };
  const handleUserChatClose = () => {
    updatePeerSelected(false);
  };

  const handleMessageSend = (message: string, to: string) => {
    console.log("sending the message",message,to)
    socket?.send({message:message,to:to})
  };

  return (
    <div className="relative overflow-x-hidden h-full overflow-y-hidden">
      <div className="h-full overflow-y-auto overflow-x-hidden">
        {!peersState.length ? (
          <h3 className="font-semibold text-blue-600">No Online Users</h3>
        ) : (
          peersState.map((x) => (
            <ChatBar
              key={x.peerId}
              peerId={x.peerId}
              handleMicMute={handleMicToggle}
            />
          ))
        )}
      </div>
      {peerSelected && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#eae2b7]  min-h-80">
          <div className="flex justify-between py-2">
            <h1 className="w-full px-2 ms-2 font-bold ">User {peerSelected}</h1>
            <span
              className="px-2 cursor-pointer font-bold"
              onClick={handleUserChatClose}
            >
              X
            </span>

            <UserArea
              handleMessageSend={handleMessageSend}
              chats={chats.get(peerSelected) || []}
              peerId={peerSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUsers;
