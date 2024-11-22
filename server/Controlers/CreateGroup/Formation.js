import { pool } from "../../pool.js";

const formation = async (req, res) => {
    const { loginuser, groupName, selectedUsers } = req.body;

    // Validate the inputs before interacting with the database
    if (!groupName || selectedUsers.length < 2) {
        return res.status(400).json({ error: "Group name is required and at least two users must be selected." });
    }

    // Use pool.connect() only for transactions
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

        // Step 2: Insert the creator as an admin and other users as members in the group_members table
        const userIds = [loginuser, ...selectedUsers.map(user => user.id)];

        // Use parameterized query for inserting all users with their roles
        const userInsertQuery = `
            INSERT INTO sahil.group_members (user_id, group_id, role)
            VALUES ${userIds.map((_, idx) => `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3})`).join(', ')}
        `;
        const userValues = [];

        // Add the creator (loginuser) as admin
        userValues.push(loginuser, groupId, 'admin');

        // Add the other users as members
        selectedUsers.forEach(user => {
            userValues.push(user.id, groupId, 'member');
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

export {formation};