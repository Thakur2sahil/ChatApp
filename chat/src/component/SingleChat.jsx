import axios from 'axios';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { contextapi } from '../contextapi';

function SingleChat() {
    const location = useLocation();
    const { setCount, setSendUserId } = useContext(contextapi);
    const { userId, username, image } = location.state;
    const receiverId = userId;
    const senderId = localStorage.getItem('userId'); // Get the logged-in user's ID
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = io('http://localhost:9000');
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom when a new message is added or when messages are fetched
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // Only runs when messages array is updated

    // Fetch chat history when the component mounts
    const fetchChatHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/single/singlemessages`, { params: { senderId, receiverId } });
            console.log(response.data);
            
            setMessages(response.data); // Set messages from the API response
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    useEffect(() => {
        fetchChatHistory();

        // Set the user in the socket connection
        socket.emit('setUser', senderId);

        // Listen for incoming messages from the server
        socket.on('receiveMessage', (data) => {
            fetchChatHistory();
            setSendUserId(data.sender_id);
            setCount(prevCount => {
                const newCount = prevCount + 1;
                localStorage.setItem('count', newCount);
                return newCount;
            });
        });

        return () => {
            socket.off('receiveMessage'); // Cleanup the socket listener on unmount
        };
    }, [senderId, receiverId]);

    // Handle sending message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = {
                sender_id: senderId,
                receiver_id: receiverId,
                message,
                id: Date.now(), // Use timestamp as a temporary ID
                timestamp: new Date().toISOString() // Add timestamp when sending
            };

            // Optimistic update: add the message immediately
            setMessages(prevMessages => [...prevMessages, newMessage]);

            // Send the message through the socket
            socket.emit('sendMessage', {
                senderId,
                receiverId,
                message,
                timestamp: newMessage.timestamp
            });

            // Clear the input field
            setMessage('');
        }
    };

    // Function to format the timestamp (Time and Date)
    const formatTimestamp = (timestamp) => {
        const messageDate = new Date(timestamp);
        const now = new Date();
    
        // Check if it's today or yesterday
        const isToday = messageDate.toDateString() === now.toDateString();
        const isYesterday = new Date(now - 86400000).toDateString() === messageDate.toDateString();
    
        // Return only time
        if (isToday) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday) {
            return ` ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            // For any other date, return only the time
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    // Function to group messages by date
    const groupMessagesByDate = (messages) => {
        const groupedMessages = [];
        let currentDate = '';

        messages.forEach(msg => {
            const msgDate = new Date(msg.timestamp);
            const today = new Date();
            const isToday = msgDate.toDateString() === today.toDateString();
            const isYesterday = new Date(today - 86400000).toDateString() === msgDate.toDateString();
            let dateLabel = '';

            if (isToday) {
                dateLabel = 'Today';
            } else if (isYesterday) {
                dateLabel = 'Yesterday';
            } else {
                dateLabel = msgDate.toLocaleDateString();
            }

            // Add a new date section when the date changes
            if (dateLabel !== currentDate) {
                currentDate = dateLabel;
                groupedMessages.push({ dateLabel, messages: [] });
            }

            // Add the message to the appropriate date section
            groupedMessages[groupedMessages.length - 1].messages.push(msg);
        });

        return groupedMessages;
    };

    // Group messages by date
    const groupedMessages = groupMessagesByDate(messages);

    return (
        <form className="h-full flex flex-col bg-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white shadow-sm p-2">
                <div className="flex items-center">
                    <img
                        src={`http://localhost:9000/${image}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-2 text-base font-semibold">{username}</div>
                </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                {groupedMessages.map((group, index) => (
                    <div key={index} className="mb-4">
                        <div className="text-center text-sm text-gray-500 mb-2">{group.dateLabel}</div>
                        {group.messages.map((msg) => (
                            <div key={msg.id} className="flex w-full justify-between">
                                {msg.sender_id != senderId ? (
                                    <div className="m-2 border rounded-md border-solid p-2 bg-gray-200 text-gray-800">
                                        {username}
                                        <div className="p-2">{msg.message} </div>
                                        <div className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</div>
                                    </div>
                                ) : (
                                    <div className="m-2 border rounded-md border-solid p-2 ml-auto bg-blue-500 text-white">
                                        You
                                        <div className="p-2">{msg.message}</div>
                                        <div className="text-xs text-gray-300">{formatTimestamp(msg.timestamp)}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll to this ref */}
            </div>

            {/* Chat Input */}
            <div className="bg-white shadow-sm">
                <div className="flex items-center space-x-4 p-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 p-2 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        Send
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SingleChat;
