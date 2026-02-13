const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Hardcoded admin credentials
        const ADMIN_CREDENTIALS = {
            userId: "admin123",
            password: "admin@123",
        };

        // Check if the provided userId matches
        if (userId !== ADMIN_CREDENTIALS.userId) {
            return res.status(400).json({ message: "Admin not found." });
        }

        // Check if the provided password matches
        if (password !== ADMIN_CREDENTIALS.password) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Generate a JWT token if login is successful
        const token = jwt.sign({ userId: ADMIN_CREDENTIALS.userId }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({
            message: "Admin logged in successfully",
            token: token,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { adminLogin };
