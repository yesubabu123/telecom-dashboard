const mongoose = require("mongoose");
const Sim = require("./models/Sim");

const names = [
  "Aarav Patel",
  "Priya Shah",
  "Rohan Mehta",
  "Ananya Singh",
  "Vikram Iyer",
  "Sana Kapoor",
  "Arjun Reddy",
  "Neha Nair",
  "Kiran Rao",
  "Maya Joshi",
  "Aditya Kumar",
  "Shreya Verma",
  "Riya Khanna",
  "Kunal Saini",
  "Isha Desai",
  "Nikhil Malhotra",
  "Divya Gupta",
  "Rahul Bhatia",
  "Sonal Bhaskar",
  "Aditi Chauhan",
  "Esha Roy",
  "Sameer Jain",
  "Priyanka Sen",
  "Arun Thomas",
  "Mini Menon",
  "Yash Sharma",
  "Tara Chakraborty",
  "Jayesh Nandan",
  "Tanvi Kulkarni",
  "Vivek Das",
  "Simran Kaur",
  "Neel Deshmukh",
  "Rhea Mishra",
  "Akash Deshpande",
  "Meera Balan",
  "Arnav Bhatt",
  "Pooja Pandey",
  "Kabir Khan",
  "Ritika Sood",
  "Kavya Naik",
  "Rajat Yadav",
  "Ira Sahni",
  "Harsh Vora",
  "Anika Ghosh",
  "Devansh Rao",
  "Sanjana Nair",
  "Ayaan Choudhary",
  "Naina Gupta",
  "Richa Sethi",
  "Anish Khatri",
  "Dia Malik",
  "Pranav Verma",
  "Alia Joseph",
  "Nikhita Rao",
  "Rohit Pillai",
  "Mira Sinha",
  "Tanish Aggarwal",
  "Anjali Nambiar",
  "Faiz Khan",
  "Rekha Menon",
  "Karan Chandra",
  "Pallavi Reddy",
  "Ishan Jain",
  "Nitya Bose",
  "Rohan Kapoor",
  "Suhana Bedi",
  "Rakesh Mehra",
  "Deepa Prasad",
  "Manav Mehta",
  "Prisha Shah",
  "Sahil Roy",
  "Parul Singh",
  "Naveen Agarwal",
  "Aarohi Desai",
  "Ritika Bhargava",
  "Aryan Malhotra",
  "Sanya Rathi",
  "Kavish Varma",
  "Anaya Nair",
  "Ramesh Joshi",
  "Sana Chopra",
  "Ishaan Bhatnagar",
  "Nisha Thakur",
  "Abhay Sethi",
  "Kiran Mehta",
  "Minal Sharma",
  "Tanay Khanna",
  "Aisha Verma",
  "Rudra Anand",
  "Shalini Pillai",
  "Aarushi Goyal",
  "Vihan Kapoor",
  "Nina Reddy",
  "Kunal Shah",
  "Hina Sharma",
  "Sai Mukherjee",
  "Aria Deshmukh",
  "Vikram Singh",
  "Rhea Menon",
  "Aman Jain",
  "Priya Sinha"
];

const providers = ["Nexa", "AstraNet", "OrbitTel", "PulseWave"];
const regions = ["North", "South", "East", "West", "Central"];
const statuses = ["active", "inactive", "blocked"];
const alertLevels = ["normal", "warning", "critical"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makePhone = (index) => {
  const prefix = "+91";
  const base = 9000000000 + index;
  return prefix + base.toString();
};

const buildRecords = () => {
  return names.map((name, index) => {
    const lastUsedDays = randomBetween(0, 420);
    const lastUsed = new Date();
    lastUsed.setDate(lastUsed.getDate() - lastUsedDays);
    const isOld = lastUsedDays >= 150;
    const status = isOld ? randomFrom(["inactive", "blocked"]) : "active";
    const availability = status === "blocked" ? "blocked" : "available";
    const speed = randomBetween(6, 190);
    const throughput = Math.max(4, Math.round(speed * (0.6 + Math.random() * 0.3)));
    const latency = randomBetween(8, 120);
    const ping = randomBetween(6, 60);
    const signalStrength = randomBetween(25, 98);
    const alertLevel = speed < 10 || latency > 100 || signalStrength < 30 ? randomFrom(["warning", "critical"]) : "normal";

    return {
      phoneNumber: makePhone(index),
      ownerName: name,
      provider: randomFrom(providers),
      region: randomFrom(regions),
      status,
      availability,
      networkSpeed: speed,
      throughput,
      latency,
      ping,
      signalStrength,
      alertLevel,
      lastUsed,
    };
  });
};

const runSeed = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/telecomDB");
    console.log("Connected to MongoDB for seeding.");
    await Sim.deleteMany({});
    const sims = buildRecords();
    await Sim.insertMany(sims);
    console.log(`Inserted ${sims.length} sample SIM records.`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

runSeed();