import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.json()); // To handle JSON payloads

const otpStore = {};

// Define your API routes here
app.get('/', (req, res) => {
    res.send('Forget password system is working!');
});

app.post('/generate-otp', (req, res) => {
    const { user, email } = req.body;
    if (!user || !email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // Set a timeout to delete the OTP after 2 minutes (120000 milliseconds)
    setTimeout(() => {
        delete otpStore[email];
        console.log(`OTP for ${email} has been deleted after 2 minutes.`);
    }, 120000); // 2 minutes

    res.status(200).json({ message: "OTP generated successfully", otp });
});

app.post('/reset-pass', (req, res) => {
    const { user, email, otp } = req.body;
    if (!user || !email) return res.status(400).json({ message: "Email is required" });

    if (otpStore[email] !== otp) {
        return res.status(400).json({ message: "Wrong OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
});

// Start the server on port 8000
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
