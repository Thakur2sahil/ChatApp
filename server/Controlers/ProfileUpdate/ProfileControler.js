import { pool } from "../../pool.js";


const profileUpdateController = async (req, res) => {
    try {
        // Extract data from request
        const { name, email, userId } = req.body;

        // Check if userId exists in the request body
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const updateFields = [];
        const values = [];

        // Update username if provided
        if (name) {
            updateFields.push(`username = $${values.length + 1}`);
            values.push(name);
        }

        // Update email if provided
        if (email) {
            updateFields.push(`email = $${values.length + 1}`);
            values.push(email);
        }

        // Update profile image if a file is provided
        if (req.file) {
            const filename = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
            updateFields.push(`profile_image = $${values.length + 1}`);
            values.push(filename);
        }

        // If there are fields to update
        if (updateFields.length > 0) {
            // Update query to update the user's data in the database
            const updateQuery = `UPDATE sahil.chat_users SET ${updateFields.join(', ')} WHERE id = $${values.length + 1}`;
            values.push(userId);  // Adding userId for WHERE clause

            // Execute the update query
            await pool.query(updateQuery, values);

            // Fetch the updated user data
            const fetchQuery = `SELECT username, email, profile_image FROM sahil.chat_users WHERE id = $1`;
            const result = await pool.query(fetchQuery, [userId]);

            // Check if user was found
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            // Return the updated user details
            const updatedUser = result.rows[0];
            return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
        } else {
            return res.status(400).json({ error: "No fields to update" });
        }
    } catch (error) {
        console.error("Error in profile update:", error);
        return res.status(500).json({ error: "An error occurred while updating the profile" });
    }
};

export {profileUpdateController};