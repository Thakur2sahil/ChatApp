import { pool } from "../../pool.js";

const addUser = async (req, res) => {
  const { selectedUsers, gId } = req.body;
  console.log(gId);

  const client = await pool.connect();
  try {
    // Start the transaction
    await client.query("BEGIN");

    // Build the insert query
    const userIds = [ ...selectedUsers.map(user => user.id)];
    const userInsertQuery = `
       INSERT INTO sahil.group_members (user_id, group_id)
            VALUES ${userIds.map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`).join(', ')}
    `;

    // Prepare the values to insert
    const userValues = [];
    selectedUsers.forEach((user) => {
      userValues.push(user.id, gId);
    });

    // Execute the query with the values
    await client.query(userInsertQuery, userValues);

    // Commit the transaction
    await client.query("COMMIT");

    // Send a success response
    res.status(200).json({ message: "User added successfully", gId });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await client.query("ROLLBACK");
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Error adding user" });
  } finally {
    // Always release the client back to the pool
    client.release();
  }
};

export { addUser };
