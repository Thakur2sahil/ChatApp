import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom'; 
import { Plus } from 'lucide-react';  
import { contextapi } from '../contextapi';

function SideBar() { 
    const loginuser = localStorage.getItem('userId'); 
    const username = localStorage.getItem('name'); 
    const navigate = useNavigate(); 
    const {count , setCount,sendUserId,fetchUnreadMessage,messageSend, setSendUserId,groupRefresh , setGroupRefresh} = useContext(contextapi)
    const [user, setUser] = useState([]); 
    const [search, setSearch] = useState('');  
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const [allGroup, setAllGroup] = useState([]);  
    const [openUserId, setOpenUserId] = useState(null);  
    const [openGroupId, setOpenGroupId] = useState(null); 
    const [currentuser, setCurrentUser] = useState(()=>{
        return parseInt(localStorage.getItem('currentuser')) || 0;
    });

    
    const fetchUser = async () => { 
        try { 
            const res = await axios.get('http://localhost:9000/api/sidebar/allusersname', { params: { loginuser } }); 
            if (res.data.length > 0) { 
                setUser(res.data); 
                setFilteredUsers(res.data);                             
            } else { 
              console.log("No data found"); 
            } 
        } catch (error) { 
            console.error("Error fetching data: " + error.message); 
        } 
    };


    const markAsRead = async (userId) => {
        try {
            const response = await axios.get('http://localhost:9000/api/sidebar/markread', { params: { userId } });
            if (response.status === 200) {
               
                fetchUnreadMessage(loginuser);
                localStorage.setItem("count",0);    
                setCount(0);
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
           
        }
    };


    const fetchGroup = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/sidebar/allgroupname', { params: { loginuser } });
            if (res.data.length > 0) {
                setAllGroup(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

   
    const handleSearch = (e) => { 
        const value = e.target.value; 
        setSearch(value); 

        if (value) { 
            const filtered = user.filter((us) => us.username.toLowerCase().includes(value.toLowerCase())); 
            setFilteredUsers(filtered); 
        } else { 
            setFilteredUsers(user); 
        } 
    };

   
    const handleSingle = (userId, username, image) => { 
        setOpenUserId(userId);  
        setCurrentUser(userId);
        localStorage.setItem("count",0);    
        setCount(0);
        localStorage.setItem("currentuser", userId);
        navigate('/dashboard/single', { state: { userId, username, image } }); 
        markAsRead(userId); 
    };

    
    const handleAllGroup = (group) => {
        setOpenGroupId(group.gid); 
        // localStorage.setItem('count', 0);
        const gname = group.gname;
        const gId = group.gid;
        navigate('/dashboard/groupChat', { state: { gname, gId } });
    };

    useEffect(() => {
        fetchUser();
        fetchGroup();
    }, []);

    useEffect(()=>{
        fetchGroup();
    },[groupRefresh])

    useEffect(()=>{
        fetchUnreadMessage(loginuser);
        if(currentuser == sendUserId)
        {
            markAsRead(currentuser)
        }
       
    },[count ])

    return ( 
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white overflow-auto">
            <div className="p-2 mt-10 font-semibold sticky top-0">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    className="border-rounded-4 outline-none text-black py-2 px-2 w-full"
                    placeholder="Search"
                />
            </div>

            {/* User list */}
            {filteredUsers.length > 0 ? (
                filteredUsers.map((use, index) => (
                    <div key={index} className="flex items-center p-4 hover:bg-gray-700 cursor-pointer active:bg-black" onClick={() => handleSingle(use.id, use.username, use.profile_image)}>
                        <img 
                            src={`http://localhost:9000/${use.profile_image}`} 
                            alt={use.username} 
                            className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div className="flex-grow flex">
                            <p className="text-sm font-semibold">{use.username} </p>
                            {/* Display unread message count for this user if the user chat is not open */}
                            {openUserId !== use.id && messageSend.map((msg, index) => (
                                msg.sender_id === use.id && (
                                    <div key={index} className="ml-2 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs rounded-full">
                                        {msg.count}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div>No users found</div>
            )}

            {/* Groups */}
            <div>Groups</div>
            {allGroup.length > 0 ? (
                allGroup.map((group, index) => (
                    <div key={index} className="flex items-center p-4 hover:bg-gray-700 cursor-pointer active:bg-black" onClick={() => handleAllGroup(group)}>
                        <div className="w-12 h-12 rounded-full bg-gray-500 mr-4 flex justify-center items-center">
                            <span className="text-white text-lg">{group.gname[0]}</span>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold">{group.gname}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div>No groups found</div>
            )}

            <div className="p-4 text-sm text-gray-400 mt-auto">
                {loginuser ? (
                    <p>Welcome, {username}!</p>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>
        </div>
    );
}

export default SideBar;
