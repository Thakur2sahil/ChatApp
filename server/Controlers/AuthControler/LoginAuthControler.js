import { pool } from "../../pool.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const JWT_SECRET = 'your_jwt_secret'; // Use an environment variable in production


const loginAuth= async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists
        const checkEmailQuery = 'SELECT * FROM sahil.chat_users WHERE email = $1';
        
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rows.length === 0) {
            return res.status(400).json({ error: "Email doesn't exist" });
        }

        const user = emailResult.rows[0];

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Generate a token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // jwtToken = token;

        res.status(200).json({ token,user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}

export {loginAuth}