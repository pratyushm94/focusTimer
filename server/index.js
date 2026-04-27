require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRouter");
const statsRoutes = require("./routes/statsRouter");
const sessionRoutes = require("./routes/sessionRouter");

const app = express();

app.use(helmet()); //security  in header, preventing embeding etc
app.use(cors({origin: process.env.CLIENT_ORIGIN, credentials: true}));
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
});
// app.get('/api', (req, res) => {
//     res.json({status: 'ok', message: 'Server is running'});
// });
app.use('/api/auth', authLimiter, authRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/session", sessionRoutes);



app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        stack: err.stack
    }); 
})

const uri = process.env.MONGODB_URI; 
mongoose.connect(uri).then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log("Server is running on port 5000");
    });
}).catch(err => {
    console.log("error captured buddy",err);
    process.exit(1);
});  

