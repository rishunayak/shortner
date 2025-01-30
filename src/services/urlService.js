import Url from "../models/urlModel.js";



export const urlShortnerService = async (longUrl, customAlias, topic,user) => {
    try {
       
        const userId=user._id;
        const existingAlias = await Url.findOne({ customAlias});

        if (existingAlias) {
            console.log("Custom alias already exists");
            throw new Error("Custom alias already exists");
        }

        const shortnerUrl = await Url.create({longUrl, customAlias, topic,userId});
        return { shortUrl:`http://localhost:5001/api/shorten/${customAlias}`,createdAt:shortnerUrl.createdAt}
    } catch (error) {
        throw new Error(error.message);
    }
};
