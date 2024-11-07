import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Get the directory of the current file using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files (like index.html, CSS, JS) from the 'public' directory
app.use(express.static(join(__dirname, 'public')));

// Serve index.html when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Handle CAPTCHA verification from the front-end
app.post('/verify-captcha', async (req, res) => {
    const token = req.body.token;  // The Turnstile token sent from the front-end

    if (!token) {
        return res.status(400).json({ success: false, message: 'Captcha token missing' });
    }

    console.log('Received token:', token); // Log the token for debugging

    const secretKey = '0x4AAAAAAAzdcC57M74t-l4uvRpEQISluL4';  // Replace with your actual Cloudflare Turnstile Secret Key

    try {
        // Send the token along with the secret key to Cloudflare's verification API
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey, // The secret key from Cloudflare
                response: token,   // The token sent from the front-end
            }),
        });

        const data = await response.json();
        console.log('Cloudflare response:', data); // Log the response from Cloudflare

        // If CAPTCHA verification is successful, send a success response
        if (data.success) {
            res.json({ success: true, message: 'Captcha verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Captcha verification failed' });
        }
    } catch (error) {
        // Handle any errors that occur during the verification request
        console.error('Error during CAPTCHA verification:', error);
        res.status(500).json({ success: false, message: 'Server error during CAPTCHA verification' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
