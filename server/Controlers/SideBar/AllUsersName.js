import { pool } from "../../pool.js";

const allusersname =async (req, res) => {
    const { loginuser } = req.query; 
  
    const query = 'SELECT id,username,email,profile_image,role FROM sahil.chat_users WHERE id != $1';
  
    try {
      const result = await pool.query(query, [loginuser]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);  // Change 2000 to 200
        
      } else {
        res.status(500).json("No data Found");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }

  export {allusersname}