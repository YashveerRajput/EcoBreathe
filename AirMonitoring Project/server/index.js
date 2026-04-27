const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let db;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT && process.env.FIREBASE_DATABASE_URL) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    db = admin.database();
    console.log('Firebase Realtime Database initialized successfully');
  } else {
    console.log('Firebase config or Database URL not found in env. Using mock data mode.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

// Mock data generator for testing
const getMockAQIData = () => ({
  aqi: Math.floor(Math.random() * 150) + 20,
  pm25: Math.floor(Math.random() * 80) + 5,
  pm10: Math.floor(Math.random() * 100) + 10,
  co2: Math.floor(Math.random() * 600) + 400,
  humidity: Math.floor(Math.random() * 40) + 30,
  temperature: Math.floor(Math.random() * 10) + 20,
  status: 'online',
  lastUpdated: new Date().toISOString()
});

// History mock data
const getMockHistory = () => {
  const history = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    history.push({
      time: time.getHours() + ':00',
      aqi: Math.floor(Math.random() * 100) + 30
    });
  }
  return history;
};

// Helper to extract timestamp from Firebase Push ID
const decodeFirebaseTimestamp = (id) => {
  const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  let time = 0;
  const idStr = id.substring(0, 8);
  for (let i = 0; i < 8; i++) {
    time = time * 64 + PUSH_CHARS.indexOf(idStr.charAt(i));
  }
  return new Date(time).toISOString();
};

// API Endpoints
app.get('/api/aqi/current', async (req, res) => {
  if (db) {
    try {
      // Fetch the most recent entry from the 'readings' folder
      const snapshot = await db.ref('readings').limitToLast(1).once('value');
      if (snapshot.exists()) {
        const val = snapshot.val();
        // Firebase returns an object with Push IDs, we need the first (and only) child
        const latestKey = Object.keys(val)[0];
        const data = val[latestKey];
        
        console.log('Latest live data found:', data);

        return res.json({
          aqi: data.aqi || 0,
          aqiCategory: data.aqiCategory || 'Unknown',
          pm25: data.pm25 || 0,
          pm10: data.pm10 || 0,
          no2: data.no2 || 12,
          co: data.co || 0.8,
          vocs: data.gas3_ppm || 0.45,
          gas1: data.gas1_ppm || 0,
          gas2: data.gas2_ppm || 0,
          status: 'online',
          lastUpdated: decodeFirebaseTimestamp(latestKey)
        });
      }
    } catch (error) {
      console.error('Realtime DB fetch error:', error);
    }
  }
  res.json(getMockAQIData());
});

app.get('/api/aqi/history', async (req, res) => {
  if (db) {
    try {
      // Fetch the last 24 entries from the 'readings' folder for the graph
      const snapshot = await db.ref('readings').limitToLast(24).once('value');
      if (snapshot.exists()) {
        const val = snapshot.val();
        // Convert the push-ID object into an array of values
        const historyArray = Object.values(val).map((item, index) => ({
          time: new Date(Date.now() - (23-index)*60*60*1000).getHours() + ':00',
          aqi: item.aqi
        }));
        return res.json(historyArray);
      }
    } catch (error) {
       console.error('History fetch error:', error);
    }
  }
  res.json(getMockHistory());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
