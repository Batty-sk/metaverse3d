import React, { useEffect, useState } from "react";
import { chatNotification, Chat } from "./ChatArea";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { muteIcon, notMutedIcon, user, send } from "../assets";
import { whosChat } from "./ChatArea";

interface chatUsersProps {
  chats: Chat;
  chatNotifications: chatNotification;
  updateChatNotifications: React.Dispatch<
    React.SetStateAction<chatNotification>
  >;
 updateChats:React.Dispatch<React.SetStateAction<Chat>>
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
    if(handleMicMute(peerId))
        updateMuted(!muted);
    
  };
  return (
    <div className="w-full  bg-[#d6ce93] p-3">
      <div className="flex justify-between">
        <div className="flex items-center cursor-pointer" onClick={()=>{
          updatePeerSelection({peerId:peerId,peerName:peerName})
        }}>
          <img src={user} height={35} width={35} alt="" />
          <h5 className={`font-mono ${bold && 'underline underline-offset-1'}`}>{peerName}</h5>
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
  chats: whosChat[];
  peerId: string;
};
const UserArea = ({ handleMessageSend,chats,peerId }: UserAreaProp) => {
  const [message, updateMessage] = useState<string>("");
  return (
    <>
      <div className="md:h-3/5 h-2/5 bg-slate-50 m-2 flex flex-col items-end rounded-md
      overflow-y-scroll">
        {chats.map((x,i)=>{{
          return <div key={i}>
         {x.user && <h4  className="bg-lime-300 m-2 w-fit rounded-md font-mono px-2 py-1">{x.user}</h4>}
          {x.me && <h4 key={i} className="bg-slate-300 m-2 w-fit rounded-md font-mono px-2 py-1">{x.me}</h4>
 }
          </div>
        }})}
      </div>
      <div className="flex flex-wrap justify-center items-center">
        <input
          type="text"
          name="input"
          id=""
          placeholder="Enter your message.."
          className="rounded-md outline outline-1 outline-amber-800 md:p-3 p-1 w-5/6 "
          value={message}
          onChange={(e) => {
            updateMessage(e.target.value);
          }}
        />
        <span className="md:ms-3 mx-1 cursor-pointer" onClick={()=>handleMessageSend(message,peerId)}>
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
  updateChats,
  updateChatNotifications,
  
}: chatUsersProps) => {
  console.log("chats",chats,chatNotifications)
  const { peersState,socket,playersMedia } = useContext(SocketContext);
  const [peerSelected, updatePeerSelected] = useState<{peerId:string,peerName:string} | false>(false);

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
    if (playersMedia?.current.has(peerId)){
      let playerMic = playersMedia.current.get(peerId)
      playerMic!.mutes = !playerMic!.mutes
      console.log("muutting the peer id ",peerId,playersMedia.current.get(peerId));
      return true
    }
    return false;
  };
  const handleUserChatClose = () => {
    updatePeerSelected(false);
  };

  const handleMessageSend = (message: string, to: string) => {
    console.log("sending the message",message,to)
    socket?.emit("send-message",{msg:message,to:to})
    updateChats((prevChats) => {
      const newChats = new Map(prevChats);
      if (newChats.has(to)) {
        const chat = newChats.get(to);
        chat?.push({ user: "", me: message });
      } else {
        newChats.set(to, [{ user: "", me: message }]);
      }
      return newChats;
    });
  };

  return (
    <div className="relative overflow-x-hidden md:min-h-96 min-h-80">
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
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#eae2b7]">
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
