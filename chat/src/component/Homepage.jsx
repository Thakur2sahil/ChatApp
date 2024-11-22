import React, { useEffect, useState } from 'react'

function Homepage() {
    const [animationClass, setAnimationClass] = useState('opacity-0');  // Start with an invisible element

    const username = localStorage.getItem('name');

    useEffect(() => {
        // Set animation class to fade in after component mounts
        setAnimationClass('animate-fadeIn opacity-100');
    }, []);

    return (
        <div className='flex justify-center items-center border border-solid min-h-full bg-gray-400 p-0 m-0'>
            <h1 className={`font-semibold text-6xl transition-opacity duration-1000 ${animationClass}`}>
                Welcome {username}!!<br /> Chat Application
            </h1>
        </div>
    );
}

export default Homepage;
