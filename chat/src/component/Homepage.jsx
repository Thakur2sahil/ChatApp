import React, { useEffect, useState } from 'react'

function Homepage() {
    const [animationClass, setAnimationClass] = useState('opacity-0');  // Start with an invisible element

    const username = localStorage.getItem('name');
    const image = localStorage.getItem('image');

    useEffect(() => {
        // Set animation class to fade in and slide in from the right after component mounts
        setAnimationClass('opacity-100 translate-x-0');
    }, []);

    return (
        <div className='flex flex-col items-center border border-solid min-h-full bg-gray-400 p-0 m-0'>
            <div className='mt-10'>
                <img
                    src={`http://localhost:9000/${image}`}
                    alt={`${username}`}
                    className='w-60 h-60 border-none rounded-full'  // Make the image circular
                />
                <div className='font-semibold text-center text-6xl'>{username}</div>
            </div>
            <h1 className={`font-semibold text-6xl transition-all duration-1000 transform ${animationClass}`}>
                Welcome to Chat Application
            </h1>
        </div>
    );
}

export default Homepage;
