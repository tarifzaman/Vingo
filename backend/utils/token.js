import jwt from "jsonwebtoken"; // Import the jsonwebtoken library to create/verify tokens

/**
 * Function to generate a JSON Web Token (JWT) for a user
 * @param {string} userID - The unique ID of the user from the database
 * @returns {string} - The generated signed token
 */
const genToken = async (userID) => {
    try {
        // Sign the token: 
        // 1. {userID}: The "payload" containing the user info you want to store in the token
        // 2. process.env.JWT_SECRET: The private key from your .env file used to sign the token
        // 3. {expiresIn: "7d"}: Sets the token to expire in 7 days for security
        const token = await jwt.sign({ userID }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });

        // Return the successfully created token to be used in cookies or headers
        return token;
        
    } catch (error) {
        // Log any errors (e.g., if the secret key is missing or signing fails)
        console.log("Error generating token:", error);
    }
};

export default genToken; // Export the function so it can be used in your controllers