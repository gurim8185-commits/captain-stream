const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const Batch = require('./models/Batch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const SECRET_KEY = "my_super_secret_verification_key";
const GPLINKS_API_KEY = "15b3072d76aa94482d55eea4cdd1a7123ba1c819";

// MongoDB Atlas Connection URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gurim8185_db_user:CAPTAINxPW123@cluster0.hfhx8nc.mongodb.net/captainpw?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 1. Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Batches Fetch API Route
app.get('/api/batches', async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search,$options: 'i' };
        }
        if (category && category !== 'all') {
            query.category = category;
        }

        const batches = await Batch.find(query).lean();
        res.json(batches);
    } catch (err) {
        console.error("Fetch batches error:", err);
        res.status(500).json({ error: "Batches load nahi ho sake!" });
    }
});

// 3. GPLinks Key Token Route
app.get('/api/get-key-link', async (req, res) => {
    try {
        const token = jwt.sign({ access: true }, SECRET_KEY, { expiresIn: '24h' });
        const host = req.get('host');
        const protocol = req.protocol;
        const destinationUrl = `${protocol}://${host}/verify.html?token=${token}`;

        const gplinksUrl = `https://gplinks.in/api?api=${GPLINKS_API_KEY}&url=${encodeURIComponent(destinationUrl)}`;
        const response = await fetch(gplinksUrl);
        const data = await response.json();

        if (data && data.status === "success" && data.shortenedUrl) {
            res.json({ shortenerUrl: data.shortenedUrl });
        } else {
            res.json({ shortenerUrl: destinationUrl });
        }
    } catch (err) {
        res.status(500).json({ error: "Key generation fail!" });
    }
});

// 4. Stream Access API Route
app.get('/api/stream', async (req, res) => {
    const { key, batchId, subjectId, chapterId, lectureId } = req.query;

    if (!key) {
        return res.status(401).json({ error: "Access Denied: Key Daalna Zaroori Hai!" });
    }

    try {
        jwt.verify(key, SECRET_KEY);

        const batch = await Batch.findOne({ id: batchId });
        if (!batch) return res.status(404).json({ error: "Batch nahi mila!" });

        const subject = batch.subjects.find(s => s.id === subjectId);
        const chapter = subject?.chapters.find(c => c.id === chapterId);
        const lecture = chapter?.lectures.find(l => l.id === lectureId);

        if (!lecture) {
            return res.status(404).json({ error: "Lecture nahi mila!" });
        }

        res.json({
            title: lecture.title,
            streamUrl: lecture.streamUrl,
            notesUrl: lecture.notesUrl
        });

    } catch (err) {
        return res.status(403).json({ error: "Invalid ya Expired Key!" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CAPTAINxPW Engine running on port ${PORT}`);
});