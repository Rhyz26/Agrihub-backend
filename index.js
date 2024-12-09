const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "raymond215?", // Replace with your MySQL password
  database: "agrihub", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database!");
});

// Form submission route
app.post("/submit-form", (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  const sql = `
    INSERT INTO contacts (first_name, last_name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.execute(
    sql,
    [firstName, lastName, email, phone || null, message],
    (err) => {
      if (err) {
        console.error("Error saving contact details:", err.message);
        return res
          .status(500)
          .json({ message: "Error saving contact details" });
      }
      res.status(200).json({ message: "Contact details saved successfully!" });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
