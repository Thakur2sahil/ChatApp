import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { IoTriangleSharp } from "react-icons/io5";

function GroupChat() {
  const location = useLocation();
  const socket = io('http://localhost:9000');
  const { gname, gId } = location.state;
  const username = localStorage.getItem('name');
  const senderId = localStorage.getItem('userId');
  const [groupDetail, setGroupDetail] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [allGroupUser, setAllGroupUser] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [tri , setTri] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchGroupDetail = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/group/detail', { params: { gId } });
      if (res.data) {
        setGroupDetail(res.data);
        console.log(res.data);
        
      } else {
        console.log('No group details found');
      }
    } catch (error) {
      console.error('Error fetching group detail:', error);
    }
  };

  const fetchGroupMessages = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/group/messages', { params: { gId } });
      if (res.data) {
        setMessages(res.data);
              
      } else {
        console.log('No data found');
      }
    } catch (error) {
      console.log({ error: 'An error occur' });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        gId,
        senderId,
        username,
        message,
      };
      console.log('groupSendMessage', messageData);
      socket.emit('groupSendMessage', messageData);
      fetchGroupMessages();
      setMessage('');
    }
  };

  useEffect(() => {
    fetchGroupDetail();
    fetchGroupMessages();
    socket.emit('groupsetUser', { senderId, gId });

    // Listen for the new message and update the state
    socket.on('newMessage', (newMessage) => {
      fetchGroupMessages();
    });

    // Clean up the socket event listener on unmount
    return () => {
      socket.off('newMessage');
    };
  }, [gId, senderId]);

  const handleGroupInfo = async (e) => {

    setIsDropdownVisible(true);
    setTri(true)

    try {
      const res = await axios.get('http://localhost:9000/api/group/alluser', { params: { gId } });
      if (res.data) {
        console.log(res.data);
        setAllGroupUser(res.data);
      } else {
        setAllGroupUser([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDropdown = (e) => {
    e.stopPropagation();  
    setTri(false);
    setIsDropdownVisible(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
    
   
      {/* Navbar for the page */}
      <div className="sticky top-0 z-10 flex bg-white shadow-sm p-2">
        {groupDetail.length > 0 ? (
          <div className="flex items-center p-2">
            {groupDetail.map((grp) => (
              <div key={grp.id} className="ml-2 text-base font-semibold">
                {grp.group_name}
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
       
        <div className="ml-auto p-2  text-center font-semibold cursor-pointer mr-4 flex items-center relative">
        {groupDetail.length > 0 ? (
          <div className="flex items-center p-2">
            {groupDetail.map((grp) => (
              <div key={grp.id} className="ml-2 text-base font-semibold">
              {grp.role == 'admin' ?
               <div className='mr-8'>Add</div>
               : null
              }
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div>
        Group Info
          {/* Drop Down */}
          {tri ?<button className="ml-2 text-gray-500 hover:text-gray-700" onClick={handleCloseDropdown} ><IoTriangleSharp /></button> :
          <button className="ml-2 text-gray-500 hover:text-gray-700"  onClick={handleGroupInfo} >▼</button>
           }
          {/* Group Info Dropdown */}
          {isDropdownVisible && (
            <div className="absolute bg-white shadow-lg rounded-lg p-2 z-10 mt-2 ml-6 left-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">Group Members</span>
                <button
                  onClick={handleCloseDropdown}
                  className="text-gray-500 hover:text-gray-700"
                >
                  X
                </button>
              </div>
              {allGroupUser.length > 0 ? (
                allGroupUser.map((user) => (
                  <div key={user.id} className="flex mt-2 ">
                    <img
                      src={`http://localhost:9000/${user.image}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover m-2"
                    />
                    <div className='text-center font-semibold '>{user.username}</div>
                  </div>
                ))
              ) : (
                <div>No users available</div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
     
      {/* Message  */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="flex w-full justify-between">
            {msg.user_id != senderId ? (
  <div className="m-2 border rounded-md border-solid p-2 bg-gray-200 text-gray-800 message-left">
    {msg.username}
    <div className="p-2">{msg.message}</div>
  </div>
) : (
  <div className="m-2 border rounded-md border-solid p-2 ml-auto bg-blue-500 text-white message-right">
    You
    <div className="p-2">{msg.message}</div>
  </div>
)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} >
      {/* Chat Box */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </form>
    </div>
  );
}

export default GroupChat;