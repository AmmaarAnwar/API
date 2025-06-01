const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Here you could send an email, store in DB, etc.
  console.log("Received contact form:", { name, email, subject, message });

  res.status(200).json({ message: "Message received successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
