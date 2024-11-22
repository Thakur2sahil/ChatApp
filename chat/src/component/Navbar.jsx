import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contextapi } from '../contextapi';
import { Plus } from 'lucide-react';

function Navbar() {
    const { username, userImage } = useContext(contextapi);
    const navigate = useNavigate();

    const handleLog = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('image');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleCreateGroup = () => {
        navigate('/dashboard/groupRoom');
    }

    const handleUpdate = () =>{
        navigate('/dashboard/update');
    }

    const handleHome = () =>{
        navigate('/dashboard/home')
        localStorage.setItem('currentuser',0);
    }

    return (
        <div className="bg-gray-800  top-0 left-0 right-0 z-10 w-full">
            <div className="flex justify-between items-center max-w-none mx-auto px-4 py-2">
                <div className="flex items-center " >
                
                    <img 
                        src={userImage ? `http://localhost:9000/${userImage}` : 'default-profile.png'} 
                        alt="User" 
                        className="w-10 h-10 rounded-full mr-3 cursor-pointer" 
                        onClick={handleHome}
                    />
                  
                    <span className="text-white text-lg cursor-pointer" onClick={handleHome}>{username || 'Guest'}</span>
               
                </div>
                <div className="hidden md:flex space-x-4">
                <span  onClick={handleUpdate} className="text-gray-300 text-lg hover:cursor-pointer hover:text-white">Update Profile</span>
                <div className='text-gray-300 text-lg hover:cursor-pointer hover:text-white flex' onClick={handleCreateGroup}>
                New Group  <Plus />
            </div>
                    <button 
                        onClick={handleLog} 
                        className="text-gray-300 hover:text-white"
                    >
                        Logout
                    </button>
                   
                </div>
                {/* Hamburger menu for mobile */}
                <div className="md:hidden">
                    <button
                        className="text-gray-300 hover:text-white focus:outline-none"
                        onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
                    >
                        {/* Hamburger icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div id="mobile-menu" className="hidden md:hidden bg-gray-700">
                <div className="flex flex-col items-center p-4">
                <span  onClick={handleUpdate} className="text-gray-300 text-lg hover:cursor-pointer hover:text-white">Update Profile</span>
                <div className='text-gray-300 text-lg hover:cursor-pointer hover:text-white flex' onClick={handleCreateGroup}>
                New Group  <Plus />
            </div>
                    <button 
                        onClick={handleLog} 
                        className="text-gray-300 hover:text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
