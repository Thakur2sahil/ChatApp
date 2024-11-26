import React, { useEffect } from 'react';
import { Route, Routes,  useNavigate } from 'react-router-dom';
import Signup from './component/signup';
import UpdaeUserProfile from './component/UpdaeUserProfile';
import SingleChat from './component/SingleChat';
import Homepage from './component/Homepage';
import Layout from './component/Layout';
import Login from './component/Login';
import CreateGroupRoom from './component/CreateGroupRoom';
import GroupChat from './component/GroupChat';


function UserDashboard() {
    const token = localStorage.getItem('token'); // Adjust this based on your local storage key
    const userRole = localStorage.getItem('role'); // Adjust this based on your local storage key
    const navigate = useNavigate();

    // useEffect(()=>{
    //     if(! token)
    //     {
    //         if(navigate('/signup'))
    //         {
    //             navigate('/signup')
    //         }
    //         else
    //        { navigate('/')} 
    //     }

    // }, [token, navigate])

    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signup' element={ <Signup />} />
                <Route path='/dashboard' element={token ? <Layout /> :  <Login/> }>
                    <Route path='home' element={<Homepage />} />
                    <Route path='update' element={<UpdaeUserProfile />} />
                    <Route path='single' element={<SingleChat />} />
                    <Route path='groupRoom' element={<CreateGroupRoom/>} />
                    <Route path='groupChat' element={<GroupChat/>} />
                </Route>
            </Routes>
        </>
    );
}

export default UserDashboard;
