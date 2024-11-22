import axios from "axios";
import React ,{ createContext, useEffect, useState } from "react";


export const contextapi = createContext();

export const Myprovider = ({children}) =>{

    const [userImage, setUserImage] = useState(null);
    const [username, setUserName] = useState('');
    const [useremail , setUserEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const token = localStorage.getItem('token')
    const [count , setCount] = useState(()=>{
      return  parseInt(localStorage.getItem('count')) || 0;
    });
    const[sendUserId , setSendUserId] = useState(0);
    const [userCount , setUserCount] = useState(0);
    const [groupRefresh , setGroupRefresh] = useState(0);


    useEffect(() => {
        
        const ftechdata = async () =>{

            try {
            const res = await axios.get('http://lcoalhost:9000/context/userinfo' )
            if(res.data)
            {
                console.log(res.data);
                
            }
            else{
                console.log("NO data");
                
            }
            } catch (error) {
                console.log(error);
            }
        }

        setUserEmail(localStorage.getItem('email'));
        setUserImage(localStorage.getItem('image'));
        setUserName(localStorage.getItem('name'));
        
        
    }, []);

    useEffect(()=>{
        localStorage.setItem('count' ,count);
    },[count]);

    
    return (
        <contextapi.Provider value={{ userImage, username, userId, useremail,count,sendUserId,groupRefresh , setGroupRefresh, setSendUserId,  setCount, setUserEmail, setUserImage, setUserName }}>
            {children}
        </contextapi.Provider>
    );
}
