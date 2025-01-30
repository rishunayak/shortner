import admin from "../config/firebaseAdmin.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";




export const verifyGoogleSignIn = async (idToken) => {
    try {
        // Verify Google ID token using Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Find or create user in MongoDB
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                googleId: uid,
                email,
                name,
                profilePicture: picture,
                authProvider: "google",
            });
            await user.save();
        }

        // Generate JWT token for authentication
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return { user, token };
    } catch (error) {
        throw new Error("Invalid Google ID token");
    }
};
