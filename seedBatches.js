const mongoose = require('mongoose');
const Batch = require('./models/Batch');

const MONGO_URI = "mongodb+srv://gurim8185_db_user:CAPTAINxPW123@cluster0.hfhx8nc.mongodb.net/captainpw?retryWrites=true&w=majority&appName=Cluster0";

const initialBatches = [
  {
    id: "infinite-practice",
    name: "Infinite Practice",
    tagline: "JEE & NEET Question Practice",
    banner: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    category: "PRACTICE",
    type: "practice",
    subjects: []
  },
  {
    id: "arjuna-jee-2027",
    name: "Arjuna JEE 2027",
    tagline: "For IIT-JEE Aspirants",
    banner: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    category: "JEE",
    subjects: [
      {
        id: "physics",
        name: "Physics By Rahul Yadav Sir",
        teacher: "Rahul Yadav Sir",
        icon: "fa-bolt",
        chapters: [
          {
            id: "units",
            name: "Units and Measurements",
            lectures: [
              {
                id: "lec-01",
                title: "Lec 01 : Dimensional Analysis",
                streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "lakshya-jee-2027",
    name: "Lakshya JEE 2027",
    tagline: "For JEE Aspirants",
    banner: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    category: "JEE",
    subjects: []
  },
  {
    id: "prayas-2027",
    name: "Prayas 2027",
    tagline: "For IIT-JEE Aspirants",
    banner: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    category: "JEE",
    subjects: []
  },
  {
    id: "parishram-2027",
    name: "Parishram 2027 (Class 12th)",
    tagline: "For CBSE Board & CUET",
    banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    category: "BOARDS",
    subjects: []
  },
  {
    id: "yakeen-neet-2027",
    name: "Yakeen NEET 2027",
    tagline: "For NEET Dropper Aspirants",
    banner: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop",
    category: "NEET",
    subjects: []
  }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas...");
        
        await Batch.deleteMany({});
        await Batch.insertMany(initialBatches);
        
        console.log("Sabhi Batches MongoDB Atlas me upload ho chuke hain!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
}

seedDatabase();