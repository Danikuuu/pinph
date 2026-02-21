
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

const cities = [
  { name: "Manila, Philippines", coords: [120.9842, 14.5995] },
  { name: "Quezon City, Philippines", coords: [121.0437, 14.6760] },
  { name: "Cebu City, Philippines", coords: [123.8854, 10.3157] },
  { name: "Davao City, Philippines", coords: [125.6128, 7.1907] },
  { name: "Baguio, Philippines", coords: [120.5960, 16.4023] },
  { name: "Iloilo City, Philippines", coords: [122.5621, 10.7202] },
  { name: "Palawan, Philippines", coords: [118.7384, 9.8349] },
  { name: "Tagaytay, Philippines", coords: [120.9517, 14.1153] },
  { name: "Siargao, Philippines", coords: [126.1700, 9.8482] },
  { name: "Vigan, Philippines", coords: [120.3869, 17.5747] }
];

const tagsPool = ["travel", "beach", "food", "city", "mountain", "island", "adventure"];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("🌱 Connected to MongoDB");

  await User.deleteMany({});
  await Note.deleteMany({});

  // Create 20 users
  const users = await User.insertMany(
    Array.from({ length: 20 }).map((_, i) => ({
      username: `user${i + 1}`,
      email: `user${i + 1}@test.com`,
      password: "password123",
      bio: "Explorer of the Philippines 🇵🇭"
    }))
  );

  console.log("👤 Users created");

  const notes = [];

  for (let i = 0; i < 120; i++) {
    const city = randomFrom(cities);
    const author = randomFrom(users);

    // Random likes
    const likes = users
      .filter(() => Math.random() > 0.7)
      .map(u => u._id);

    // Random comments
    const comments = users
      .filter(() => Math.random() > 0.85)
      .map(u => ({
        user: u._id,
        text: "This place is amazing! 🇵🇭✨"
      }));

    notes.push({
      author: author._id,
      title: `Hidden Spot PH #${i + 1}`,
      body: "A beautiful place worth visiting. Highly recommended!",
      location: {
        type: "Point",
        coordinates: city.coords, // [lng, lat]
        name: city.name,
        isExact: Math.random() > 0.3
      },
      tags: tagsPool.filter(() => Math.random() > 0.6),
      likes,
      comments,
      isPublic: true
    });
  }

  await Note.insertMany(notes);

  console.log("📝 120 Notes created");
  console.log("✅ Seeding complete");

  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});