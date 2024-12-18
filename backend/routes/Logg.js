const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

// Initialize the OAuth2Client with your client ID
const client = new OAuth2Client("1053544965563-19t51kpatl3mq8nfc3jfqhn9072q4anj.apps.googleusercontent.com");

/**
 * POST /auth/google
 * Route for Google authentication.
 */
router.post('/auth/google', async (req, res) => {
  const { token } = req.body; // Extract token from request body

  try {
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1053544965563-19t51kpatl3mq8nfc3jfqhn9072q4anj.apps.googleusercontent.com",
    });

    // Get user information from the token payload
    const payload = ticket.getPayload();

    // Log user info for debugging
    console.log("User info:", payload);

    // Here you can handle user authentication or registration logic
    // For example, you could check if the user exists in your database
    // If not, register the user; otherwise, authenticate them

    // Send back the user data as a response
    res.status(200).json({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).send("Unauthorized");
  }
});

module.exports = router;
