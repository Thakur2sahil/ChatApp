import {pool} from '../../pool.js'

const details =  async (req, res) => {
    const { gId } = req.query;
   
  
    try {
      const query = `SELECT id,group_name,created_by FROM sahil.chat_groups WHERE id=$1`;
      const result = await pool.query(query, [gId]);
  
      if (result.rows.length > 0) {
        // console.log("Group Details:", result.rows);
        res.status(200).json(result.rows);
      } else {
        console.log("No data found for gId:", gId);
        res.status(400).json("No data Found");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  }

  export {details}