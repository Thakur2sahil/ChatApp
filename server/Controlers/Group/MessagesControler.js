import {pool} from '../../pool.js'

const messages =  async (req, res)=>{
    
    const {gId} = req.query;
    
    try {

        const query = `select * from sahil.group_messages where group_id=$1 `;
        const result = await pool.query(query,[gId]);
        // console.log((result.rows));
        if(result.rows)
        {
            res.status(200).json(result.rows)
        }
        else
        {
            res.status(400).json("No data found");
        }
        
        
    } catch (error) {
        console.log(error);
        
    }
    
    
  }

  export {messages};