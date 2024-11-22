import { pool } from "../../pool.js";
import bcrypt from 'bcrypt';

const signUp =  async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const singUpField = [];
        const value = [];

        // Validate if fields are provided
        if (!email) {
            return res.status(400).json({ error: 'Email field is required' });
        }
        if (!name) {
            return res.status(400).json({ error: 'Name field is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password field is required' });
        }

        // Build the fields for the SQL query dynamically
        if (email) {
            singUpField.push('email');
            value.push(email);
        }
        if (name) {
            singUpField.push('username');
            value.push(name);
        }
        if (password) {
            singUpField.push('password');
            value.push(await bcrypt.hash(password, 10));  // Hash the password
        }

        if (req.file) {
            const filename = `upload/${req.file.filename.replace(/\\/g, "/")}`;
            singUpField.push('profile_image');
            value.push(filename);
        }

        // Check if email already exists
        const checkEmailQuery = 'SELECT * FROM sahil.chat_users WHERE email = $1';
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert user into the database
        const insertQuery = `
            INSERT INTO sahil.chat_users (${singUpField.join(', ')}) 
            VALUES (${singUpField.map((_, index) => '$' + (index + 1)).join(', ')})
        `;
        

        await pool.query(insertQuery, value);

        res.status(201).json({ message: 'User registered successfully' });

        const to = email;
        const subject = "Your Profile Has Been Created in the Chat Application";
        const htmlContent = `Welcome ${name}, Thank you for signing up to our application!`;

        // sendEmail(to,subject,htmlContent);

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}

export {signUp};