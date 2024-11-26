import { pool } from "../../pool.js";

const userInfo = async (req,res)=>{
    const {gId,senderId} = req.query;
    
    try {
        
        const query = `select * from sahil.group_members where user_id =$1 and group_id=$2`;

        const result = await pool.query(query,[senderId,gId]);

        if(result.rows)
        {
            return res.status(200).json(result.rows[0])
        }

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({message:error})
    }
    
}

export {userInfo}