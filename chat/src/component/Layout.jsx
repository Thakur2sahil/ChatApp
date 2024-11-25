import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Navbar from './Navbar';

function Layout() {
    return (
        <div className="p-0 m-0 flex h-screen max-w-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <SideBar />
            </div>
            
            {/* Main Content */}
            <div className="flex flex-col flex-grow h-full">
                {/* Navbar */}
                <div className="bg-gray-900 text-white">
                    <Navbar />
                </div>
                
                {/* Outlet for nested routes */}
                <div className="flex-grow overflow-y-auto bg-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
