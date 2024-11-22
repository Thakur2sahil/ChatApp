import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { contextapi } from '../contextapi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdaeUserProfile() {
    const { username, useremail, setUserEmail, setUserImage, setUserName } = useContext(contextapi);

    const userId = localStorage.getItem('userId');
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);  
    const navigate = useNavigate();

    const handleName = (e) => {
        e.preventDefault();
        setName(e.target.value);
    };

    const handleEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('userId', userId);
        if (name) formData.append('name', name);
        if (email) formData.append('email', email);
        if (file) formData.append('file', file);
    
        try {
            const res = await axios.post('http://localhost:9000/api/profileupdate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (res.status === 200) {
                toast.success(`${res.data.user.username} Profile is Updated`)
                // Handle successful response
                setUserName(res.data.user.username);
                setUserEmail(res.data.user.email);
    
                // Optionally update localStorage with new data
                localStorage.setItem('name', res.data.user.username);
                localStorage.setItem('email', res.data.user.email);
    
                // Only update the image in localStorage if a new image is uploaded
                if (file) {
                    localStorage.setItem('image', res.data.user.profile_image);
                    setUserImage(res.data.user.profile_image);
                }
                
                // Clear file state and input field
                setFile(null);  // Clear the file state
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';  // Manually clear the file input field
                }

                setTimeout(()=>{navigate('/dashboard/home')},2000)
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Optionally handle errors or show a toast notification
        }
    };

    return (
        <div className='min-w-full flex items-center justify-center h-full'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-sm w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Update</h2>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <input
                        type='email'
                        value={email}
                        onChange={handleEmail}
                        placeholder='Enter Your Email'
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='text'  // Corrected to 'text' instead of 'name'
                        value={name}
                        onChange={handleName}
                        placeholder='Enter Your Name'
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='file'
                        ref={fileInputRef}  // Add ref to the file input
                        onChange={handleFileChange}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        type='submit'
                        className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200'
                    >
                        Submit
                    </button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} />
        </div>
    );
}

export default UpdaeUserProfile;
