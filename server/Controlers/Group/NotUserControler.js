import { pool } from "../../pool.js";

const notUser = async (req,res)=>{
const {gId} = req.query;

    try {
        
        const query = `SELECT cu.*
FROM sahil.chat_users AS cu
LEFT JOIN sahil.group_members AS gm
  ON cu.id = gm.user_id AND gm.group_id = $1
WHERE gm.user_id IS NULL;`;

        const result = await pool.query(query,[gId]);
        if (result.rows.length > 0) {
            
            return res.status(200).json(result.rows);
        } else {
            return res.status(200).json([]);
        }
        
    } catch (error) {
        console.log(error);
        
    }

}

export {notUser}