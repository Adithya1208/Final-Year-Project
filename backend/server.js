const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/bank", require("./routes/bank"));

// Blockchain routes
app.use("/api/blockchain", require("./routes/blockchain"));


// Swagger Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to AML System Backend');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
