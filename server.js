const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Frontend files (index.html, verify.html) serve karne ke liye
app.use(express.static(__dirname));

const SECRET_KEY = "my_super_secret_verification_key";
const GPLINKS_API_KEY = "15b3072d76aa94482d55eea4cdd1a7123ba1c819";

function getBatches() {
    const data = fs.readFileSync(path.join(__dirname, 'batches.json'), 'utf-8');
    return JSON.parse(data);
}

// 1. Home Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Batches Data API
app.get('/api/batches', (req, res) => {
    try {
        const batches = getBatches();
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: "batches.json file load nahi ho saki!" });
    }
});

// 3. GPLinks Shortener Integration Route
app.get('/api/get-key-link', async (req, res) => {
    try {
        // 24 ghante ke liye JWT token generate karna
        const token = jwt.sign({ access: true }, SECRET_KEY, { expiresIn: '24h' });

        // Destination URL (jahan user GPLinks complete karke pahuchega)
        const host = req.get('host');
        const protocol = req.protocol;
        const destinationUrl = `${protocol}://${host}/verify.html?token=${token}`;

        // GPLinks API call
        const gplinksUrl = `https://gplinks.in/api?api=${GPLINKS_API_KEY}&url=${encodeURIComponent(destinationUrl)}`;
        
        const response = await fetch(gplinksUrl);
        const data = await response.json();

        // Agar GPLinks ne successfully short link bana diya
        if (data && data.status === "success" && data.shortenedUrl) {
            res.json({ shortenerUrl: data.shortenedUrl });
        } else {
            console.error("GPLinks API Response:", data);
            // Fallback: Agar API me koi issue aaye toh direct destination link
            res.json({ shortenerUrl: destinationUrl });
        }
    } catch (err) {
        console.error("Link generation error:", err);
        res.status(500).json({ error: "Key link generate nahi ho saka!" });
    }
});

// 4. Video Stream Access API (Key Protected)
app.get('/api/stream', (req, res) => {
    const { key, batchId, subjectId, chapterId, lectureId } = req.query;

    if (!key) {
        return res.status(401).json({ error: "Access Denied: Key Daalna Zaroori Hai!" });
    }

    try {
        jwt.verify(key, SECRET_KEY);

        const batches = getBatches();
        const batch = batches.find(b => b.id === batchId);
        const subject = batch?.subjects.find(s => s.id === subjectId);
        const chapter = subject?.chapters.find(c => c.id === chapterId);
        const lecture = chapter?.lectures.find(l => l.id === lectureId);

        if (!lecture) {
            return res.status(404).json({ error: "Lecture nahi mila!" });
        }

        res.json({
            title: lecture.title,
            streamUrl: lecture.streamUrl
        });

    } catch (err) {
        return res.status(403).json({ error: "Invalid ya Expired Key!" });
    }
});

// Cloud dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CAPTAINxPW Engine running on port ${PORT}`);
});