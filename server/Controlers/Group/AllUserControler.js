import {pool} from '../../pool.js';

const allUserDetail= async(req,res)=>{

    const{gId} = req.query;
    
    try {
        
        const query =`SELECT  gm.role,cu.id, cu.username, cu.email, cu.profile_image AS image
                      FROM sahil.group_members AS gm
                      JOIN sahil.chat_users AS cu
                      ON gm.user_id = cu.id
                      WHERE gm.group_id = $1`;

        const result = await pool.query(query,[gId]);
        if(result)
        {
            // console.log(result);
            res.status(200).json(result.rows);            
        }
        else
        {
            res.status(500).json({message:"No dtaa found"})
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Error occur"});
    }
    
  }

  export {allUserDetail}