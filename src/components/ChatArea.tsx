import React, { useEffect, useState } from "react";
import { chatIcon, globeIcon } from "../assets";
import { SocketContext } from "../contexts/Socket";
import { useContext } from "react";
import ChatUsers from "./ChatUsers";



const NotificationComponent = ({ chatNotification }: { chatNotification: chatNotification }) => {
  const totalNotifications = Array.from(chatNotification.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <div className="absolute bottom-0 right-0 rounded-full bg-red-500">
      {totalNotifications > 0 && (
        <div>
          <p className="text-white">{totalNotifications}</p>
        </div>
      )}
    </div>
  );
};

interface chatMessage {
  from: string;
  message: string;
}

export type Chat = Map<string, string[]>;
export type chatNotification = Map<string, number>;

const ChatArea = () => {
  const { socket } = useContext(SocketContext);
  const [chatOpen, updateChatOpen] = useState<boolean>(false);
  const [chats, updateChats] = useState<Chat>(new Map());
  const [chatNotification, updateChatNotifications] =
  useState<chatNotification>(new Map());
  useEffect(() => {
    socket?.on("chat-messages", handleChatsMessages);
    return () => {  
      socket?.off("chat-messages", handleChatsMessages);
    };
  }, [socket]);
  const handleChatsMessages = (args: chatMessage) => {
    updateChats((prevChats) => {
      const newChats = new Map(prevChats);

      if (newChats.has(args.from)) {
        const chat = newChats.get(args.from);
        chat?.push(args.message);
      } else {
        newChats.set(args.from, [args.message]);
      }

      return newChats;
    });
    updateChatNotifications((prevNotificatons) => {
      const newNotification = new Map(prevNotificatons);
      if (newNotification.has(args.from)) {
        const notification = newNotification.get(args.from);
        newNotification.set(args.from, notification ? notification + 1 : 1);
      } else {
        newNotification.set(args.from, 1);
      }
      return newNotification;
    });
  };
  if (!chatOpen)
    return (
      <div className="relative">
        <img
          src={chatIcon}
          height={80}
          width={80}
          className="cursor-pointer"
          onClick={() => updateChatOpen(true)}
        />

        <NotificationComponent chatNotification={chatNotification} />
      </div>
    );
  return (
    <div className="min-h-96 h-96 min-w-96 w-4/12 bg-[#efebce] rounded-sm m-2">
      <div className="flex justify-center p-2">
        <h1 className="text-3xl font-mono w-full text-black text-center flex justify-center font-bold">Global <img src={globeIcon} className="animate ms-2" height={35} width={35} /> </h1>
          <span
            className="text-2xl font-bold mx-2 text-red-600 cursor-pointer"
            onClick={() => updateChatOpen(false)}
          >
          X
        </span>
      </div> 
      <div className="h-full px-2">
        <ChatUsers chatNotifications={chatNotification} chats={chats} updateChatNotifications={updateChatNotifications}/>
      </div>
    </div>
  );
};

export default ChatArea;
