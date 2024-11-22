import { pool } from "../../pool.js";

const markread = async (req, res) => {
    const { userId } = req.query; // Correctly accessing query parameters
    // console.log("in markread", userId);
    
    
    const query = `
        UPDATE sahil.chat_messages
        SET messagenot = 'read'
        WHERE sender_id = $1
    `;

    try {
        const result = await pool.query(query, [userId]); // Use await to handle the promise
        // console.log(result);
        res.status(200).json({ message: "Messages successfully marked as read." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update messages." });
    }
}

export {markread}