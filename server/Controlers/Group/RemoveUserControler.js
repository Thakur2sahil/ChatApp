import { pool } from "../../pool.js";

const removeUser = async (req, res) => {
  const { userId, gId } = req.query;  // Use userId instead of user
  
  console.log(userId, gId);
  
  try {
    // Ensure the query uses both userId and gId as parameters
    const query = `DELETE FROM sahil.group_members WHERE user_id=$1 AND group_id=$2 `;

    // Pass both parameters to the query
    const result = await pool.query(query, [userId, gId]);

    console.log(result.rows[0]);

    res.status(200).json({ result: result.rows[0] });  // Return status 200 for success
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

export { removeUser };
