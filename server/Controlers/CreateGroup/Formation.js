import { pool } from "../../pool.js";

const formation = async (req, res) => {
    const { loginuser, groupName, selectedUsers } = req.body;

    // Validate inputs before interacting with the database
    if (!loginuser || !groupName || selectedUsers.length < 2) {
        return res.status(400).json({ error: "Login user, group name, and at least two users must be provided." });
    }

    const client = await pool.connect();
    
    try {
        // Start the transaction
        await client.query("BEGIN");

        // Step 1: Insert the group into the chat_groups table
        const groupQuery = `
            INSERT INTO sahil.chat_groups (group_name, created_by)
            VALUES ($1, $2) 
            RETURNING id
        `;
        const groupCreateResult = await client.query(groupQuery, [groupName, loginuser]);
        const groupId = groupCreateResult.rows[0].id;

        // Step 2: Insert the creator as a creator and other users as members in the group_members table
        const userIds = [loginuser, ...selectedUsers.map(user => user.id)];

        // Prepare query and values for inserting users into group_members
        const userInsertQuery = `
            INSERT INTO sahil.group_members (user_id, group_id, role, created_by)
            VALUES ${userIds.map((_, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`).join(', ')}
        `;
        const userValues = [];

        // Add the creator (loginuser) as creator
        userValues.push(loginuser, groupId, 'admin', 'creator');

        // Add the other users as members (excluding the creator)
        selectedUsers.forEach(user => {
            if (user.id !== loginuser) {
                userValues.push(user.id, groupId, 'member', 'added');
            }
        });

        // Execute the batch insert for all users
        await client.query(userInsertQuery, userValues);

        // Step 3: Commit the transaction
        await client.query('COMMIT');
        
        // Send success response
        res.status(201).json({ message: "Group created successfully", groupId });

    } catch (error) {
        // Rollback the transaction if an error occurs
        await client.query("ROLLBACK");
        console.error("Error creating group:", error);
        res.status(500).json({ error: "Error creating group" });
    } finally {
        // Always release the client back to the pool
        client.release();
    }
}

export {formation}
