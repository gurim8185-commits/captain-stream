const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    id: String,
    title: String,
    streamUrl: String,
    notesUrl: String,
    duration: String
});

const ChapterSchema = new mongoose.Schema({
    id: String,
    name: String,
    lectures: [LectureSchema]
});

const SubjectSchema = new mongoose.Schema({
    id: String,
    name: String,
    teacher: String,
    icon: String,
    chapters: [ChapterSchema]
});

const BatchSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    tagline: String,
    banner: String,
    category: { type: String, default: "JEE" },
    type: { type: String, default: "batch" },
    subjects: [SubjectSchema]
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);