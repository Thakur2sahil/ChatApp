    import axios from 'axios';
    import React, { useEffect, useRef, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { io } from 'socket.io-client';
    import { IoTriangleSharp } from "react-icons/io5";
    import {  X } from 'lucide-react';
    import { toast, ToastContainer } from 'react-toastify';

    function GroupChat() {
      const navigate = useNavigate();
      const location = useLocation();
      const socket = io('http://localhost:9000');
      const {  gId } = location.state || {};
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
      const [userRole , setUserRole] = useState(null)
      const [removeButton , setRemoveButton] = useState(false);
      const [roleButton , setRoleButton] = useState(false);
      const [selectedUserForRemove, setSelectedUserForRemove] = useState(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
       

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

      const fetchUserInfo = async () =>{
        try {
          
          const res = await axios.get('http://localhost:9000/api/group/userinfo',{params:{gId,senderId}});
          const role = res.data.role;
              if(role === 'admin')
              {
                setUserRole(role);
              
              }
              else{
                setUserRole(null);
              }
          
        } catch (error) {
          console.log(error);
        }
      }

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
        fetchUserInfo();
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
          const res = await axios.get('http://localhost:9000/api/group/alluser', { params: { gId ,senderId} });
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
          // Remove the selected user from the user list
          setUser(prevUsers => prevUsers.filter(u => u.id !== user.id));
        } else {
          toast.error(`${user.username} Already Selected`);
        }
      };

      const handleRemoveUser = (userId) => {
        setSelectedUsers(prevSelected => {
          const newSelected = prevSelected.filter(user => user.id !== userId);
          const removedUser = prevSelected.find(user => user.id === userId);
          if (removedUser) {
            setUser(prevUsers => [...prevUsers, removedUser]); // Add the removed user back to the available users list
          }
          return newSelected;
        });
      };

      const handleCross = (e) => {
        e.stopPropagation();  
        setIsAddUser(false);
        setSelectedUsers([])
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

      
      const handleCrossReomve = (e) =>{
        e.stopPropagation();
        
        setRemoveButton(false)
      }

      const handleCrossRole = (e) =>{
        e.stopPropagation();
        setRoleButton(false)
      }

      const handleUserRemove = (e, user) => {
        e.stopPropagation();
        setRemoveButton(true);
        setSelectedUserForRemove(user);  // Store the user for removal
      };

      const handleUserRole = (e, user) => {
        e.stopPropagation();
        setRoleButton(true);
        setSelectedUserForRole(user); 
      };

      const handleRemoveTheUser = async (user) => {
        
        
        try {
          const result = await axios.delete('http://localhost:9000/api/group/removeuser', {
            params: { userId: user.id, gId }  // Pass user.id instead of the entire user object
          });
      
          if (result.status === 200) {  // Check for success status 200
          
            setRemoveButton(false)
            setTri(false);
            setIsDropdownVisible(false);
            if(user.id == senderId)
            {
              navigate('/dashboard/home');
            }
            toast.success(`${user.username} is deleted successfully`);

          } else {
            console.log("Database error");
          }
      
        } catch (error) {
          console.log(error);
        }

      };

      const handleUpdateRole = async (user) => {
       
        console.log(user);
        

        try {
          const newRole = user.role === 'admin' ? 'member' : 'admin';
          const result = await axios.post('http://localhost:9000/api/group/roleupdate', {
            userId: user.id,
            role: newRole,
            gId,
          });
      
          if (result.status === 200) {
            toast.success(`${user.username}'s role updated to ${newRole}`);
            setRoleButton(false);
            setTri(false);
            setIsDropdownVisible(false);
          } else {
            toast.error("Failed to update role.");
          }
        } catch (error) {
          console.error('Error updating role:', error);
          toast.error("An error occurred while updating the role.");
        }
        
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

                      {user.length>0 ? 
                        <div>
                          {user.map((use)=>(
                            <div
                            key={use.id}
                            onClick={() => handleSelectUser(use)}
                            className="flex p-2 hover:bg-gray-200 border-none text-center  overflow-auto  cursor-pointer"
                          >
                            <div className='text-center w-full '>
                              <div className="block text-center font-semibold">{use.username}</div>
                              <div className="block text-center text-sm text-gray-500">{use.email}</div>
                            </div>
                          </div>
                          ))}
                        </div>
                      :null}
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
                  userRole === 'admin' ?
                  <div className="absolute bg-white shadow-lg rounded-lg p-2 z-10 mt-2 right-0 ">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">Group Members</span>
                    <button onClick={handleCloseDropdown} className="text-gray-500 hover:text-gray-700">
                      X
                    </button>
                  </div>
                  {allGroupUser.length > 0 ? (
                    allGroupUser.map((user) => (
                      <div key={user.id} className="flex mt-1 w-72">
                      <img src={`http://localhost:9000/${user.image}`} alt={user.username} className="w-8 h-8 rounded-full object-cover m-1" />
                      <div className="flex flex-col justify-center text-center font-semibold flex-grow">{user.username}</div>
                      <div className="flex space-x-2 ml-1 items-center">
                        {/* Remove button */}
                        <button 
                        onClick={(e)=>handleUserRemove(e,user)}
                        className="border-none bg-red-700 p-2 rounded-xl text-white hover:bg-red-500 w-20 text-xs">Remove</button>
                            {/*  For remove the User */}
                            {removeButton && selectedUserForRemove && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-96 h-auto p-8 shadow-2xl rounded-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold  ">Remove the user</h1>
          <div className="cursor-pointer" onClick={handleCrossReomve}>
            <X />
          </div>
        </div>

        <div className="flex mt-4 justify-center items-center space-x-4">
          <img src={`http://localhost:9000/${selectedUserForRemove.image}`} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          <h1 className="text-2xl font-semibold">{selectedUserForRemove.username}</h1>
        </div>

        <div className="mt-6">
          <button className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={()=>handleRemoveTheUser(selectedUserForRemove)}
          >
            Remove from the group
          </button>
        </div>
      </div>
    </div>
  )}

                        {/* Edit role */}
                        <button 
                        onClick={(e)=>handleUserRole(e,user)}
                        className="border-none bg-blue-700 p-2 rounded-xl text-white hover:bg-blue-500 w-20 text-xs">Role</button>
                        {/*  For remove the User */}
                        {roleButton && selectedUserForRole && (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-96 h-auto p-8 shadow-2xl rounded-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold  ">Edit the Role</h1>
          <div className="cursor-pointer" onClick={handleCrossRole}>
            <X />
          </div>
        </div>

        <div className="flex mt-4 justify-center items-center space-x-4">
          <img src={`http://localhost:9000/${selectedUserForRole.image}`} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          <h1 className="text-2xl font-semibold">{selectedUserForRole.username}</h1>
        </div>

        <div className="mt-6">
        {selectedUserForRole.role ==='admin' ?
        <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={()=>handleUpdateRole(selectedUserForRole)}
        >
        Change role to member
      </button> : 
          <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={()=>handleUpdateRole(selectedUserForRole)}
          >
            Change role to admin
          </button>
    }
        </div>
      </div>
    </div>
  )}

                      </div>
                    </div>
                    
                    ))
                  ) : null}
                </div>
                
                  : 
                  <div className="absolute bg-white shadow-lg rounded-lg p-2 z-10 mt-2 ml-10 w-44 left-0">
                  <div className="flex justify-between items-center mb-2"> 
                    <span className="font-semibold text-lg ">Group Members</span>
                    <button onClick={handleCloseDropdown} className="text-gray-500 hover:text-gray-700 ">
                      X
                    </button>
                  </div>
                  {allGroupUser.length > 0 ?
                    (
                    allGroupUser.map((user) => (
                      <div key={user.id} className="flex mt-2 ">
                        <img src={`http://localhost:9000/${user.image}`} alt={user.username} className="w-8 h-8 rounded-full object-cover m-1" />
                        <div className="text-center font-semibold">{user.username}</div>
                      </div>
                    ))
                  )
                    : (
                    null
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
                {/* <div className="text-center text-gray-500 text-sm mb-2">{formatDate(date)}</div> */}
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
          <form onSubmit={handleSendMessage} className='w-full'>
            <div className="bg-white shadow-sm p-2">
              <div className="flex items-center space-x-4 ">
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
          <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
        </div>
      );
    }

    export default GroupChat;
