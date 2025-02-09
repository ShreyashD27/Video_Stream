require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI; // Using environment variable for security

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  console.log("MongoDB Connected");
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "videos" });
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// **UPLOAD VIDEO**
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      res.status(201).json({ message: "File uploaded successfully", file: uploadStream.id });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **GET VIDEO LIST**
app.get("/videos", async (req, res) => {
  try {
    const files = await gridFSBucket.find().toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **STREAM VIDEO**
app.get("/video/:filename", async (req, res) => {
  try {
    const file = await gridFSBucket.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) return res.status(404).json({ error: "Video not found" });

    const readStream = gridFSBucket.openDownloadStreamByName(req.params.filename);
    res.set("Content-Type", file[0].contentType);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **DELETE VIDEO**
app.delete("/video/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    await gridFSBucket.delete(fileId);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting video: " + error.message });
  }
});

// Export app for Vercel deployment
module.exports = app;
