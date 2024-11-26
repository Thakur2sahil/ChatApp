import axios from "axios";
import React ,{ createContext, useCallback, useEffect, useState } from "react";


export const contextapi = createContext();

export const Myprovider = ({children}) =>{

    const [userImage, setUserImage] = useState(null);
    const [username, setUserName] = useState('');
    const [useremail , setUserEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const token = localStorage.getItem('token')
    const loginuser = localStorage.getItem('userId'); 
    const [count , setCount] = useState(()=>{
      return  parseInt(localStorage.getItem('count')) || 0;
    });
    const[sendUserId , setSendUserId] = useState(0);
    const [userCount , setUserCount] = useState(0);
    const [groupRefresh , setGroupRefresh] = useState(0);
    const [messageSend, setMessageSend] = useState([]); 


    const fetchUnreadMessage = async (loginuser) => {
        try {
            const res =  await axios.get('http://localhost:9000/api/sidebar/unreadmessage', { params: { loginuser } });
            if (res.data) {
               
                setMessageSend(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const ftechdata = async () =>{

    //     try {
    //     const res = await axios.get('http://lcoalhost:9000/context/userinfo' )
    //     if(res.data)
    //     {
    //         console.log(res.data);
            
    //     }
    //     else{
    //         console.log("NO data");
            
    //     }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    useEffect(() => {
        
        fetchUnreadMessage();
       

        setUserEmail(localStorage.getItem('email'));
        setUserImage(localStorage.getItem('image'));
        setUserName(localStorage.getItem('name'));
        
        
    }, []);

    useEffect(()=>{
        localStorage.setItem('count' ,count);
         
    },[count]);
    useCallback(()=>{
        fetchUnreadMessage();  
    },[count])

    
    
    return (
        <contextapi.Provider value={{ userImage, username, userId, useremail,count,sendUserId,groupRefresh , messageSend, setMessageSend,setGroupRefresh, setSendUserId,  setCount, setUserEmail, setUserImage, setUserName,fetchUnreadMessage }}>
            {children}
        </contextapi.Provider>
    );
}
