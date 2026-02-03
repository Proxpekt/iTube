import express from "express";
import cors from "cors"; // Import CORS middleware to allow frontend requests from different origin
import cookieParser from "cookie-parser"; // Import cookie-parser to read cookies from incoming requests
import { LIMIT } from "./constants.js";

const app = express();

// Enable CORS for the frontend domain defined in environment variables
// credentials:true allows cookies and authorization headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // frontend URL
    credentials: true, // allow cookies & auth headers
  })
);

// Parse incoming JSON request bodies and limit their size
// Converts JSON payload into req.body
app.use(
  express.json({
    limit: LIMIT, // prevent large payload attacks
  })
);

// Parse URL-encoded form data (HTML forms)
// extended:true allows nested objects in form data
app.use(
  express.urlencoded({
    extended: true,
    limit: LIMIT, // restrict request size
  })
);

// Serve static files from "public" folder (images, CSS, uploads, etc.)
// Example: localhost:8000/image.png
app.use(express.static("public"));

// Parse cookies from request headers and attach them to req.cookies
// Used mainly for authentication (refresh tokens)
app.use(cookieParser());

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// Routes imports
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

export { app };
