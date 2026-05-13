import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import Note from './models/note.model.js';

const MONGO_URI = process.env.MONGO_URI;

const cities = [
  { name: 'Manila, Philippines', coords: [120.9842, 14.5995] },
  { name: 'Quezon City, Philippines', coords: [121.0437, 14.676] },
  { name: 'Cebu City, Philippines', coords: [123.8854, 10.3157] },
  { name: 'Davao City, Philippines', coords: [125.6128, 7.1907] },
  { name: 'Baguio, Philippines', coords: [120.596, 16.4023] },
  { name: 'Iloilo City, Philippines', coords: [122.5621, 10.7202] },
  { name: 'Palawan, Philippines', coords: [118.7384, 9.8349] },
  { name: 'Tagaytay, Philippines', coords: [120.9517, 14.1153] },
  { name: 'Siargao, Philippines', coords: [126.17, 9.8482] },
  { name: 'Vigan, Philippines', coords: [120.3869, 17.5747] },
];

const tagsPool = ['travel', 'beach', 'food', 'city', 'mountain', 'island', 'adventure'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log('🌱 Connected to MongoDB');

  await User.deleteMany({});
  await Note.deleteMany({});

  const users = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      User.create({
        username: `user${i + 1}`,
        email: `user${i + 1}@test.com`,
        password: 'password123',
        bio: 'Explorer of the Philippines 🇵🇭',
      }),
    ),
  );

  console.log('👤 Users created');

  const notes = [];

  for (let i = 0; i < 120; i++) {
    const city = randomFrom(cities);
    const author = randomFrom(users);

    const likes = users.filter(() => Math.random() > 0.7).map((u) => u._id);

    const comments = users
      .filter(() => Math.random() > 0.85)
      .map((u) => ({
        user: u._id,
        text: 'This place is amazing! 🇵🇭✨',
      }));

    notes.push({
      author: author._id,
      title: `Hidden Spot PH #${i + 1}`,
      body: 'A beautiful place worth visiting. Highly recommended!',
      location: {
        type: 'Point',
        coordinates: city.coords,
        name: city.name,
        isExact: Math.random() > 0.3,
      },
      tags: tagsPool.filter(() => Math.random() > 0.6),
      likes,
      comments,
      isPublic: true,
    });
  }

  await Note.insertMany(notes);

  console.log('📝 120 Notes created');
  console.log('✅ Seeding complete');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
