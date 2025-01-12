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
  peerName:string
  updatePeerSelection:React.Dispatch<React.SetStateAction<{peerId:string,peerName:string} | false>>
  bold:boolean
}

const ChatBar = ({ peerId, handleMicMute,peerName,updatePeerSelection,bold }: chatBarProps) => {
  const [muted, updateMuted] = useState(false);
  const handleMuteChange = () => {
    handleMicMute(peerId);
    updateMuted(!muted);
  };
  return (
    <div className="w-full  bg-[#d6ce93] p-3">
      <div className="flex justify-between">
        <div className="flex items-center cursor-pointer" onClick={()=>{
          updatePeerSelection({peerId:peerId,peerName:peerName})
        }}>
          <img src={user} height={35} width={35} alt="" />
          <h5 className={`font-mono ${bold && 'font-bold'}`}>{peerName}</h5>
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
      <div className="md:h-3/5 h-2/5 bg-slate-50 m-2 flex flex-col items-end rounded-md
      overflow-y-scroll">
        {chats.map((x,i)=>{{
          return <h4 key={i} className="bg-lime-300 m-2 w-fit rounded-md font-mono px-2 py-1">{x}</h4>
        }})}
      </div>
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
  console.log("chats",chats,chatNotifications)
  const { peersState } = useContext(SocketContext);
  const [peerSelected, updatePeerSelected] = useState<{peerId:string,peerName:string} | false>(false);
    const { socket } = useContext(SocketContext);

useEffect(()=>{
  if(!peerSelected)
    return
  if(chatNotifications.has(peerSelected.peerId))
    updateChatNotifications((prevNotificatons) => {
      const newNotification = new Map(prevNotificatons);
      newNotification.set(peerSelected.peerId, 0);
      return newNotification;
    });},[peerSelected])

  const handleMicToggle = (peerId: string) => {
    return true;
  };
  const handleUserChatClose = () => {
    updatePeerSelected(false);
  };

  const handleMessageSend = (message: string, to: string) => {
    console.log("sending the message",message,to)
    socket?.emit("send-message",{msg:message,to:to})
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
              bold={chatNotifications.get(x.peerId)!>0?true:false}
              updatePeerSelection={updatePeerSelected}
              peerName={x.peerName}
              peerId={x.peerId}
              handleMicMute={handleMicToggle}
            />
          ))
        )}
      </div>
      {peerSelected && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#eae2b7]  min-h-80">
          <div className="flex justify-between py-2">
            <h1 className="w-full px-2 ms-2 font-bold ">{peerSelected.peerName}</h1>
            <span
              className="px-2 cursor-pointer font-bold"
              onClick={handleUserChatClose}
            >
              X
            </span>
            </div>
            <UserArea
              handleMessageSend={handleMessageSend}
              chats={chats.get(peerSelected.peerId) || []}
              peerId={peerSelected.peerId}
            />
        </div>
      )}
    </div>
  );
};

export default ChatUsers;
