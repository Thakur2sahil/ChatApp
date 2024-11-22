import { pool } from "../../pool.js";

const unreadmessage= async (req, res) => {

    const { loginuser } = req.query;
  
    
    const query = `
        SELECT messagenot, sender_id, COUNT(sender_id)
        FROM sahil.chat_messages
        GROUP BY messagenot, sender_id ,receiver_id 
        HAVING messagenot = 'unread' and receiver_id =$1
    `;
    
    try {
        const result = await pool.query(query,[loginuser]);
        // console.log("The unread messages are:", result.rows);
        res.status(200).json(result.rows);  // Send the result back to the client
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server error");
    }
}

export {unreadmessage}