import dotenv from "dotenv"; // Load environment variables from a .env file
dotenv.config();
import connectDb from "./config/db.js"; // Import the database connection function
import cookieParser from "cookie-parser"; // Middleware to parse cookies from requests
import authRouter from "./routes/auth.routes.js"; // Import authentication routes
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing

const app = express(); // Initialize the Express application
const port = process.env.PORT || 5000; // Set the server port from .env or default to 5000

// Configure CORS to allow requests from the frontend (Vite default: 5173)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Allow cookies to be sent back and forth
}));

app.use(express.json()); // Middleware to parse JSON bodies in requests
app.use(cookieParser()); // Use cookie-parser middleware

// Define the base path for authentication routes
app.use("/api/auth", authRouter);

// Start the server and connect to the database
app.listen(port, () => {
    connectDb(); // Connect to MongoDB
    console.log(`server started at ${port}`);
});