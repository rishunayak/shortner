import { verifyGoogleSignIn } from "../services/authService.js";

export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Missing ID token" });
        }

        const { user, token } = await verifyGoogleSignIn(idToken);
        return res.status(200).json({ user, token });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json({ message: "Authentication failed" });
    }
};
