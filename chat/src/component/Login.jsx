import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contextapi } from '../contextapi';
import { toast, ToastContainer } from 'react-toastify';

function Login() {
    const { setUserImage, setUserName } = useContext(contextapi);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('image');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
    },[])

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:9000/api/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            setUserImage(res.data.user.profile_image);
            setUserName(res.data.user.username);
            localStorage.setItem('image', res.data.user.profile_image);
            localStorage.setItem('name', res.data.user.username);
            localStorage.setItem('userId', res.data.user.id);
            localStorage.setItem('email', res.data.user.email);
            toast.success('Login successful!');
            setTimeout(()=>{navigate('/dashboard/home')},2000)
          
        }catch (error) {
            // Check if the error is from the response and display the message
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error); // Display backend error message
            } else {
                toast.error('An unknown error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className='min-w-full flex items-center justify-center h-screen'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-sm w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <input
                        type='email'
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                    />
                    <div className='relative mb-4'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                        <button
                            type='button'
                            onClick={togglePasswordVisibility}
                            className='absolute right-3 top-2 text-gray-600'
                        >
                            {showPassword ? '👁️' : '🙈'}
                        </button>
                    </div>
                    <button
                        type='submit'
                        className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200'
                    >
                        Submit
                    </button>
                    <p className='mt-4 text-center'>
                        Don't have an account? <Link to="/signup" className='text-blue-500'>Signup</Link>
                    </p>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} />
        </div>
    );
}

export default Login;
