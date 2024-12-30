import React, { useEffect, useState } from "react";
import { chatIcon } from "../assets";
import { SocketContext } from "../contexts/Socket";
import { useContext } from "react";

const ChatBar = () => {
  return (
    <div className="w-full mx-2">
      <div className="flex justify-between">
        <div className="flex">
          <span>User</span>
          <h5>Username</h5>
        </div>
        <div className="flex">
          <span>Mic</span>
        </div>
      </div>
    </div>
  );
};

const NotificationComponent = (chatNotification: chatNotification) => {
  const totalNotifications = Array.from(chatNotification.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <div>
      {totalNotifications > 0 && (
        <div>
          <p>Total Notifications: {totalNotifications}</p>
        </div>
      )}
    </div>
  );
};
interface chatMessage {
  from: string;
  message: string;
}

type Chat = Map<string, string[]>;
type chatNotification = Map<string, number>;

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

        <NotificationComponent {...chatNotification} />
      </div>
    );
  return (
    <div className="min-h-96  min-w-96 w-4/12" style={{ color: "white" }}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-mono text-green-400">Users</h1>
        <span
          className="text-white cursor-pointer"
          onClick={() => updateChatOpen(false)}
        >
          X
        </span>
      </div>
      <div className="chat-area">
        <ChatBar />
      </div>
      <div className="chat-section"></div>
    </div>
  );
};

export default ChatArea;
