import {pool} from '../../pool.js'


const singlemessages = async(req,res)=>{
    const {receiverId,senderId} = req.query;

    console.log(receiverId,senderId);
    
    
    try {
        const query = `
            SELECT * FROM sahil.chat_messages
            WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
            ORDER BY timestamp ASC`;
        const result = await pool.query(query, [senderId, receiverId]);

        if (result.rows.length > 0) {
            
            return res.status(200).json(result.rows);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    
}

export {singlemessages};