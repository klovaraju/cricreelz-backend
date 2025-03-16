const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const userRoutes=require('./Routes/userRoutes')
const bodyparse=require('body-parser')
const cors = require('cors')
dotenv.config()
const app = express()

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Vite's default port
    credentials: true
}));

app.use(bodyparse.json())

// MongoDB connection with SSL options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.log("MongoDB connection error:", error))

const PORT = process.env.PORT || 4000 // Changed default port to 4000

app.use('/user',userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.use('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})