import express from "express";
import cors from "cors";
import fs from "fs/promises"; 
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // needed on Railway
});

app.use(cors());
app.use(express.json());

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};
createTable();



app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await pool.query(
      "INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );
    res.status(200).json({ message: "Contact saved to DB ✅" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to save contact" });
  }
});
app.get("/api/contacts", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM contacts ORDER BY submitted_at DESC"
  );
  res.json(result.rows);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
