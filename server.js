import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder from command line or default to "public"
const folder = process.argv.slice(2).join(" ") || "Qr code genorator";
const folderPath = path.join(__dirname, folder);

// Check folder exists
if (!fs.existsSync(folderPath)) {
  console.error(`Folder "${folder}" does not exist!`);
  process.exit(1);
}

// Serve static files
app.use(express.static(folderPath));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(folderPath, "index.html"));
});

// Optional SPA fallback
app.use((req, res) => {
  const filePath = path.join(folderPath, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(folderPath, "index.html"));
  }
});

// Use port 80 (requires admin)
const PORT = 80;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving folder "${folder}" at http://neel.fun/`);
});

