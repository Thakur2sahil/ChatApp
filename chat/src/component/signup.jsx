import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if(!name || !email || !password)
        // {
        //     toast.error("All field are required");
        // }
        
        const formData = new FormData();
        formData.append('name', name);
       formData.append('email', email);
        formData.append('password', password);
       if(image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:9000/api/auth/sign', formData);
            toast.success('Signup successful!');
            setTimeout(() => {
                navigate('/')
            }, 2000);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : 'Signup failed. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-sm w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                   
                    <input
                        type='text'
                        value={name}
                        placeholder='Enter Your Full Name'
                        onChange={(e) => setName(e.target.value)}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        
                    />
                    
                   
                    <input
                        type='email'
                        value={email}
                        placeholder='Enter Your Email'
                        onChange={(e) => setEmail(e.target.value)}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        
                    />

                   
                    <input
                        type='password'
                        value={password}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        
                    />
                   
                    <input
                        type='file'
                        onChange={(e) => setImage(e.target.files[0])}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    
                    <button
                        type='submit'
                        className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200'
                    >
                        Sign Up
                    </button>
                    <p className='mt-4 text-center'>
                        Don't have an account? <Link to="/" className='text-blue-500'>Login</Link>
                    </p>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Signup;
