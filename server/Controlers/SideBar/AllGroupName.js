import { pool } from "../../pool.js";


const allgroupname = async (req, res) => {
    const { loginuser } = req.query;

    // Validate that the loginuser is provided
    if (!loginuser) {
        return res.status(400).json({ error: "loginuser query parameter is required" });
    }

    const query = `
        SELECT cg.group_name AS gname, cg.id AS gid
        FROM sahil.chat_groups AS cg
        JOIN sahil.group_members AS gm ON cg.id = gm.group_id
        WHERE gm.user_id = $1
    `;

    try {
        const result = await pool.query(query, [loginuser]);
        
        // Check if there are any rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows); // Send all rows if available
        } else {
            res.status(404).json({ message: "No data found" }); // Use 404 for not found
        }
    } catch (error) {
        console.error(error); // Log the error to the server logs
        res.status(500).json({ error: "An error occurred while fetching groups" }); // More descriptive error
    }
}

export {allgroupname}