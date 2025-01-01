import React, { useEffect, useState } from "react";
import { chatNotification, Chat } from "./ChatArea";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { muteIcon, notMutedIcon,user } from "../assets";

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
          <span onClick={handleMuteChange} className="cursor-pointer"> <img src={muted?muteIcon:notMutedIcon} height={30} width={30} alt={muted?"muted":"unmuted"}/> </span>
        </div>
      </div>
    </div>
  );
};
const ChatUsers = ({
  chats,
  chatNotifications,
  updateChatNotifications,
}: chatUsersProps) => {
  const { peersState } = useContext(SocketContext);
  useEffect(() => {
    console.log("useeffect called.");
    return () => {
      console.log("useeffect destructed");
    };
  }, []);

  const handleMicToggle = (peerId:string)=>{
    return true;
  }
  return (
    <div className="relative overflow-x-hidden h-full overflow-y-hidden">
    <div className="h-full overflow-y-scroll overflow-x-hidden">
      {!peersState.length?<h3>No Online Users</h3>:
      peersState.map((x) => (
        <ChatBar key={x.peerId} peerId={x.peerId} handleMicMute={handleMicToggle}/>
      ))}
    </div>
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#eae2b7]  min-h-80">
        <div className="flex justify-between py-2">
          <h1 className="w-full px-2">User</h1>
          <span className="px-2 cursor-pointer font-bold">X</span>
          </div>
          <div className="h-full bg-slate-50 m-2 rounded-md">

          </div>
    </div>
    </div>
  );
};

export default ChatUsers;
