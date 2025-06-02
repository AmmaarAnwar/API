import express from "express";
import cors from "cors";
import fs from "fs/promises";
import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        subject,
        message,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at
      FROM contacts
      ORDER BY created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
