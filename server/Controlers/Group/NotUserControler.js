import { pool } from "../../pool.js";

const notUser = async (req,res)=>{
const {gId} = req.query;

    try {
        
        const query = `SELECT gm.user_id, cu.*
        FROM sahil.group_members AS gm
        FULL JOIN sahil.chat_users AS cu
          ON gm.user_id = cu.id
        WHERE gm.user_id IS NULL OR  cu.id IS NULL AND gm.group_id=$1`;

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