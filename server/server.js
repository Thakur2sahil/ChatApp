import express from 'express';
import cors from 'cors';
import multer from 'multer';
import http from 'http';
import {pool} from './pool.js';
import { Server as socketIo } from 'socket.io';
import { sendEmail } from './sendemail.js';
import { createGroup } from './Routes/CreateGroup.js';
import { single_Chat } from './Routes/SingleChat.js';
import { group } from './Routes/Group.js';
import { sidebar } from './Routes/SideBar..js';
import { profileUpdateController } from './Controlers/ProfileUpdate/ProfileControler.js';
import { authRouter } from './Routes/AuthRoute.js';

const app = express();
const server = http.createServer(app);



const io = new socketIo(server, {  // Use socketIo here
    cors: {
        origin: "*", // Allow requests from this frontend URL
        methods: ["GET", "POST"], // Allow these HTTP methods
        allowedHeaders: ["Authorization","Content-Type"], // Allow these headers
        credentials: true // Allow cookies and credentials
    }
});
app.use(cors({
    origin: "*",  // Allow requests from the frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization","Content-Type"],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

let users = {};

io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    socket.on('setUser', (userId) => {
        users[userId] = socket.id;
        // console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });
    socket.on('groupsetUser', (userId) => {
        // console.log('Received userId:', userId.senderId);  
        users[userId.senderId] = socket.id;
        // console.log(`Group User ${userId.senderId} connected with socket ID: ${socket.id}`);
        socket.join(userId.gId);  
    });

    socket.on('groupSendMessage', async (data) => {
        const { gId, senderId, message, username } = data;
    
        try {
            // Insert the message into the database
            const query = `INSERT INTO sahil.group_messages (group_id, user_id, message, username) 
                           VALUES ($1, $2, $3, $4) 
                           RETURNING *`;
            const result = await pool.query(query, [gId, senderId, message, username]);
    
          
            const qr = `SELECT user_id FROM sahil.group_members WHERE group_id = $1`;
            const result1 = await pool.query(qr, [gId]);
    
           
            if (result1.rows.length > 0) {
             
                result1.rows.forEach((r) => {
                 
                    const receiverSocketId = users[r.user_id];
                    if (receiverSocketId) {
                        socket.to(receiverSocketId).emit('newMessage', result.rows[0]);
                    }
                });
            }
    
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    

    socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, message } = data;
        const receiverSocketId = users[receiverId];

        try {
                      
            const insertQuery = `
                INSERT INTO sahil.chat_messages (sender_id, receiver_id, message)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const result = await pool.query(insertQuery, [senderId, receiverId, message]);
            
            // console.log("Message inserted:", result.rows); // Log the result
        
            if (receiverSocketId) {
                // console.log("receiveMessage",result.rows[0]);
                io.to(receiverSocketId).emit('receiveMessage', result.rows[0]);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on('disconnect', () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
        // console.log('A user disconnected:', socket.id);
    });
});


app.use('/api/single',single_Chat);


app.use('/api/auth',authRouter)

app.get('/context/userinfo', async (req, res) => {
        
        const userQuery = `SELECT * FROM sahil.chat_users`; // Change 'id' to the actual column name if necessary
    
        try {
            const result = await pool.query(userQuery);
    
            if (result.rows.length > 0) {            
                return res.status(200).json(result.rows[0]);
            } else {
                return res.status(404).json("No data found");
            }
        } catch (error) {
            console.error("Error executing query:", error);
            return res.status(500).json("Internal server error");
        }
});

app.post('/api/profileupdate', upload.single('file'), profileUpdateController);

// all sidebar api

app.use('/api/sidebar',sidebar)

// All the create group api

app.use('/api/creategroup',createGroup);



// Grop api

app.use('/api/group',group)
  

server.listen(9000,"0.0.0.0", () => {
    console.log('Listening on port 9000');
});
