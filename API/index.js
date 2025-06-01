import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Received:", { name, email, subject, message });
  res.status(200).json({ message: "Message received successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
