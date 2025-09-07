/*const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://user1:pass1@cluster0.3qv1i47.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = 'd1';
const COLLECTION_NAME = 'c1';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// MongoDB client
let db;
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DATABASE_NAME);
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submission
app.post('/signin', async (req, res) => {
  try {
    const { email, password, staySignedIn } = req.body;
    
    // Create user document
    const user = {
      email: email,
      password: password, // In production, HASH the password!
      staySignedIn: staySignedIn === 'on' ? true : false,
      timestamp: new Date(),
      ipAddress: req.ip
    };
    
    // Insert into MongoDB
    const result = await db.collection(COLLECTION_NAME).insertOne(user);
    
    console.log('User data saved:', result.insertedId);
    
    // Send success response
    res.json({ 
      success: true, 
      message: 'Sign-in data saved successfully!',
      id: result.insertedId 
    });
    
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving data to database' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});*/
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://user1:pass1@cluster0.3qv1i47.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = 'd1';
const COLLECTION_NAME = 'c1';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

let db;

// Function to connect to MongoDB
async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    db = client.db(DATABASE_NAME);

    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop app if DB fails
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signin', async (req, res) => {
  try {
    if (!db) throw new Error('Database not connected');

    const { email, password, staySignedIn } = req.body;

    const user = {
      email,
      password, // ⚠️ For demo only – don’t store plaintext in real apps
      staySignedIn: staySignedIn === 'on',
      timestamp: new Date(),
      ipAddress: req.ip,
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(user);

    //console.log('✅ User data saved:', result.insertedId);

    res.json({
      success: true,
      message: 'Sign-in data saved successfully!',
      id: result.insertedId,
    });
  } catch (error) {
   // console.error('❌ Error saving to database:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving data to database',
    });
  }
});

// Call DB connect
connectDB();
