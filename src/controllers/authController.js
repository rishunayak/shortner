import { ResponseHandler } from "../helper/responseHandler.js";
import { verifyGoogleSignIn } from "../services/authService.js";
import Joi from 'joi';

export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body;
        const schema = Joi.object({
            idToken: Joi.string().required().messages({
                "any.required": "ID token is required",
                "string.empty": "ID token cannot be empty",
            }),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return ResponseHandler.error(res,400,error.details[0].message)
        }

        const { user, token } = await verifyGoogleSignIn(idToken);
        return res.status(200).json({ user, token });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json({ message: "Authentication failed" });
    }
};
