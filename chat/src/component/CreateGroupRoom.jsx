import axios from 'axios';
import { X } from 'lucide-react'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react';
import { toast, ToastContainer, useToast } from 'react-toastify';
import { contextapi } from '../contextapi';

function CreateGroupRoom() {
  const navigate = useNavigate();
  const [user , setUser] = useState([]);
  const {groupRefresh , setGroupRefresh} = useContext(contextapi);
  const [search,setSearch]= useState('');
  const [groupName , setGroupName] = useState('');
  const[filterGroupUser , setFilterGroupUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);  
  const [loginUser , setLoginUser] = useState({});


  useEffect(() => {
    fetchUser();
       
  }, [])
  

  const fetchUser = async () => {
    try {
      const loginuser = localStorage.getItem('userId');
      const res = await axios.get('http://localhost:9000/api/creategroup/users', { params: { loginuser } });
      if (res.data.length > 0) {
        
        setUser(res.data)
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleUserSearch = (e) =>{
    const value = e.target.value;
    setSearch(value)
    if(value)
    {
      const filteredUsers = user.filter((us) => 
        us.username.toLowerCase().includes(value.toLowerCase()) && 
        us.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilterGroupUser(filteredUsers);
      
    }
    else
    {
      setFilterGroupUser([])
    }
     
  }
  

  const handleCross = () =>{
    navigate(-1)
  }

  const handleSelectUser = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prevSelected => [...prevSelected, user]);
      // toast.success(`${user.username} is Select`) 
      setSearch('');  
      setFilterGroupUser([]); 
      setUser(prevUsers => prevUsers.filter(u => u.id !== user.id)); 
    }
    else{
      toast.error(`${user.username} Already Select`) 
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

  const handleCreateGroup = async(e) => {
    e.preventDefault();
    if(!groupName)
    {
      toast.error("Please Enter the group name")
    }
    else if(selectedUsers.length<2)
    {
      toast.error("Please Select at least 2 member for Group")
    }
    else{
      try {
        const loginuser = localStorage.getItem('userId');

        const res = await axios.post('http://localhost:9000/api/creategroup/formation',{loginuser,groupName,selectedUsers})

        if(res.status === 201)
        {
          toast.success("Group Created Successfully")
          const gId = res.data.groupId;
          console.log(gId);
          setGroupRefresh(gId);
          
          setTimeout(()=>{
            navigate('/dashboard/groupChat',{state:{gId}})
          },2000)
        }
        
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error("Failed to create group");
      }      
    }

  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white w-96 p-6 rounded-lg shadow-xl relative"> 
                  <button onClick={handleCross} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <X />
                  </button>
                  <h1 className="text-center text-3xl mb-4 text-black">Create New Group</h1>
                  <form className="flex flex-col">
                    <input 
                      type="text" 
                      placeholder="Enter the Group name" 
                      value={groupName}
                      onChange={e=>{setGroupName(e.target.value)}}
                      className="text-black mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  {selectedUsers.length ? 
                  <div className='flex flex-wrap ' > 
                    { selectedUsers.map((user)=>(
                       <div key={user.id} className='mr-1 bg-blue-600 text-white flex justify-center item-center border p-1 rounded-t-xl rounded-b-xl w-20 mb-1  text-center' >
                        <span  className='text-center text-sm ' >
                        {user.username}
                       </span>
                       <button type='button' onClick={()=>handleRemoveUser(user.id)} > <X size={16} /></button>
                       </div>
                       
                    ))

                    }
                  </div>
                  :
                  <div></div>
                  }
             {user.length>0 ? 
                        <div className='h-64 overflow-auto '>
                          {user.map((use)=>(
                            <div
                            key={use.id}
                            onClick={() => handleSelectUser(use)}
                            className="flex p-2 hover:bg-gray-200 border-none text-center   cursor-pointer"
                          >
                            <div className='text-center w-full '>
                              <div className="block text-center font-semibold">{use.username}</div>
                              <div className="block text-center text-sm text-gray-500">{use.email}</div>
                            </div>
                          </div>
                          ))}
                        </div>
                      :null}


                   
           <button onClick={handleCreateGroup} className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
                      Create Group
                    </button>
                  </form>
                </div>
                <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} />
              </div>
  )
}

export default CreateGroupRoom
