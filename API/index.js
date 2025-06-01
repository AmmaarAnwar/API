import express from "express";
import cors from "cors";
import fs from "fs/promises"; 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const CONTACTS_FILE = "./contacts.json";

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;


    let contacts = [];
    try {
      const data = await fs.readFile(CONTACTS_FILE, "utf8");
      contacts = JSON.parse(data);
    } catch (err) {

      contacts = [];
    }

    contacts.push({
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString(),
    });


    await fs.writeFile(
      CONTACTS_FILE,
      JSON.stringify(contacts, null, 2),
      "utf8"
    );

    res.status(200).json({ message: "Message saved successfully!" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
