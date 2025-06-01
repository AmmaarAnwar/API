import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

const CONTACTS_FILE = join(__dirname, "contacts.json");


try {
  await fs.access(CONTACTS_FILE);
} catch {
  await fs.writeFile(CONTACTS_FILE, "[]");
}

app.post("/api/contact", async (req, res) => {
  try {
    const contact = {
      ...req.body,
      timestamp: new Date().toISOString(),
    };

    const contacts = JSON.parse(await fs.readFile(CONTACTS_FILE, "utf8"));
    contacts.push(contact);
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Failed to save contact" });
  }
});

app.listen(3000, () => {
  console.log("Server running on https://my-portfolio-mu-snowy-34.vercel.app");
});
