import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { CiMenuFries } from "react-icons/ci";

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  return (
    <div className="h-14 flex-shrink-0 flex space-x-2 pl-2 items-center bg-gray-800 hover:bg-gray-600 duration-300">
      <div className="">
        <div className={`avatar ${getOnlineUsersStatus(selectedConversation._id)  === "Online" ? "online" : ""}`}>
          <div className="max-w-12 w-full rounded-full">
            <img src="https://loremflickr.com/200/200?random=1" alt="profile.pic"/>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start">
        <h1 className="text-lg">{selectedConversation.fullname}</h1>
        <span className="text-[12px]">
          {getOnlineUsersStatus(selectedConversation._id)}
        </span>
      </div>
    </div>
  );
}

export default Chatuser;
