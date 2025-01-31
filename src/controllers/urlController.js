import { getShortenUrlService, urlShortnerService } from "../services/urlService.js";


export const urlShortnerController = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: 'longUrl is required' });
    }
    try {
        const result = await urlShortnerService(longUrl, customAlias, topic,req.user);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getShortenUrlController = async (req, res) => {
    const { alias } = req.params;
    if (!alias) {
        return res.status(400).json({ error: 'Alias is required' });
    }
    try {
        const result = await getShortenUrlService(alias);
        
        return res.redirect(result);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json({ message: error.message });
    }
};



