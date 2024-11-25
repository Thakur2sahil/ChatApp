import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { IoTriangleSharp } from "react-icons/io5";
import { Flashlight, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

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
  const [isAddUser, setIsAddUser] = useState(false);
  const [search , setSearch] = useState('');
  const [user , setUser] = useState([]);
  const[filterGroupUser , setFilterGroupUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);  

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
    setTri(true);

    try {
      const res = await axios.get('http://localhost:9000/api/group/alluser', { params: { gId } });
      if (res.data) {
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

  const handleAddUser = async (e) => {
    e.stopPropagation();  
    setIsAddUser(true); // Only toggle this when "Add" is clicked

    // Fetch users for adding after showing modal
    try {
      const res = await axios.get('http://localhost:9000/api/group/notuser', { params: { gId } });
      if (res.data) {
        setUser(res.data);
      } else {
        setUser([]);
      }
    } catch (error) {
      console.error("Error Adding User:", error);
    }
  };

  const handleFromAddUser = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:9000/api/group/adduser', { selectedUsers, gId });
      if (result.status === 200) {
        toast.success("User added Succefully")
        setIsAddUser(false);
        setSelectedUsers([])
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      const filteredUsers = user.filter((us) =>
        us.username.toLowerCase().includes(value.toLowerCase()) &&
        us.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilterGroupUser(filteredUsers);
    } else {
      setFilterGroupUser([]);
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prevSelected => [...prevSelected, user]);
      setSearch('');  
      setFilterGroupUser([]);  
    } else {
      toast.error(`${user.username} Already Select`);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prevSelected => prevSelected.filter(user => user.id !== userId));
  };

  const handleCross = (e) => {
    e.stopPropagation();  
    setIsAddUser(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Check if the date is valid
    if (isNaN(date)) {
      return 'Invalid date';
    }
  
    // Check if the message is today
    const isToday = now.toDateString() === date.toDateString();
    if (isToday) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return  `${date.toLocaleTimeString([], options)}`;
    }
  
    // Check if the message is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();
    if (isYesterday) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return  `${date.toLocaleTimeString([], options)}`;
    }
  
    // For specific dates, return a formatted date
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString([], options);
  };
  
  // Utility function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
  
    messages.forEach((message) => {
      const date = new Date(message.sent_at).toDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });
  
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

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
       
        <div className="ml-auto p-2 text-center font-semibold cursor-pointer mr-4 flex items-center relative">
          <div>
            <div className='mr-8' onClick={handleAddUser}>Add User</div>
            {isAddUser && (
              <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <form onSubmit={handleFromAddUser} className="bg-white w-96 h-auto p-8 shadow-2xl rounded-lg relative">
                  <h1 className='text-center text-3xl mb-4 text-black'>Add the User</h1>
                  <button onClick={handleCross} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <X />
                  </button>
                 
                  <input 
                    type="search" 
                    placeholder="Choose the user" 
                    value={search}
                    onChange={handleUserSearch}
                    className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  
                  {selectedUsers.length ? (
                    <div className='flex flex-wrap mb-4'>
                      {selectedUsers.map((user) => (
                        <div key={user.id} className='mr-1 bg-blue-600 text-white flex justify-center item-center border p-1 rounded-t-xl rounded-b-xl w-20 mb-1 text-center'>
                          <span className='text-center text-sm'>{user.username}</span>
                          <button type='button' onClick={() => handleRemoveUser(user.id)}> <X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  ) : <div></div>}

                  {filterGroupUser.length > 0 && (
                    <div>
                      <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                        {filterGroupUser.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="flex p-2 hover:bg-gray-200 text-center border-none  cursor-pointer"
                          >
                            <div className='text-center'>
                              <div className="block text-center font-semibold">{user.username}</div>
                              <div className="block text-center text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    type="submit"
                  >
                    Add User
                  </button>
                </form>
              </div>
            )}
          </div>
          <div>Group Info
            {/* Drop Down */}
            {tri ? (
              <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={handleCloseDropdown}>
                <IoTriangleSharp />
              </button>
            ) : (
              <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={handleGroupInfo}>▼</button>
            )}
            
            {/* Group Info Dropdown */}
            {isDropdownVisible && (
              <div className="absolute bg-white shadow-lg rounded-lg p-2 z-10 mt-2 ml-6 left-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">Group Members</span>
                  <button onClick={handleCloseDropdown} className="text-gray-500 hover:text-gray-700">
                    X
                  </button>
                </div>
                {allGroupUser.length > 0 ? (
                  allGroupUser.map((user) => (
                    <div key={user.id} className="flex mt-2">
                      <img src={`http://localhost:9000/${user.image}`} alt={user.username} className="w-8 h-8 rounded-full object-cover m-2" />
                      <div className="text-center font-semibold">{user.username}</div>
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
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="mb-4">
            <div className="text-center text-gray-500 text-sm mb-2">{formatDate(date)}</div>
            {groupedMessages[date].map((msg) => (
              <div key={msg.id} className="flex w-full justify-between">
                {msg.user_id != senderId ? (
                  <div className="m-2 border rounded-md border-solid p-2 bg-gray-200 text-gray-800 message-left">
                    {msg.username}
                    <div className="p-2">{msg.message}</div>
                    <div className="text-xs text-gray-500">{msg.sent_at ? formatDate(msg.sent_at) : 'No date available'}</div>
                  </div>
                ) : (
                  <div className="m-2 border rounded-md border-solid p-2 ml-auto bg-blue-500 text-white message-right">
                    You
                    <div className="p-2">{msg.message}</div>
                    <div className="text-xs text-gray-200">{msg.sent_at ? formatDate(msg.sent_at) : 'No date available'}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Box */}
      <form onSubmit={handleSendMessage}>
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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </div>
  );
}

export default GroupChat;
