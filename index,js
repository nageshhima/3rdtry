// index.js (ES Module)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Use express.json() middleware to parse JSON bodies
app.use(express.json());

// Serve static files (like your HTML, CSS)
app.use(express.static('public'));

// Simple route for the homepage
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Handle CAPTCHA verification
app.post('/verify-captcha', async (req, res) => {
    const token = req.body.token;
    const secretKey = '0x4AAAAAAAzdcC57M74t-l4uvRpEQISluL4'; // Replace with your Cloudflare Turnstile Secret Key

    // Make the verification request to Cloudflare Turnstile
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
        });

        const data = await response.json();

        if (data.success) {
            res.json({ success: true, message: 'Captcha verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Captcha verification failed' });
        }
    } catch (error) {
        console.error('Error during CAPTCHA verification:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
