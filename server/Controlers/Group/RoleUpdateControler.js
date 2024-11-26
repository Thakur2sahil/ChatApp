import { pool } from "../../pool.js";

const roleUpdate = async (req, res) => {
    let { userId, role, gId } = req.body;

    // Toggle the userRole between 'admin' and 'member'
  
    console.log(role);

    try {
        // Corrected SQL query
        const query = `UPDATE sahil.group_members
                       SET role=$1
                       WHERE user_id=$2 AND group_id=$3`;

        // Execute the query with parameters
        const result = await pool.query(query, [role, userId, gId]);

        return res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating role" });
    }
};

export { roleUpdate };
