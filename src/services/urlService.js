import client from "../config/redis.js";
import Url from "../models/urlModel.js";



export const urlShortnerService = async (longUrl, customAlias, topic,user) => {
    try {
       
        const userId=user._id;
        const existingAlias = await Url.findOne({ customAlias});

        if (existingAlias) {
            console.log("Custom alias already exists");
            throw new Error("Custom alias already exists");
        }
        await client.set(customAlias, longUrl);

        const shortnerUrl = await Url.create({longUrl, customAlias, topic,userId});
        return { shortUrl:`${process.env.BASE_URL}${customAlias}`,createdAt:shortnerUrl.createdAt}
    } catch (error) {
        throw new Error(error.message);
    }
};


export const getShortenUrlService = async (customAlias) => {
    try {
        const longUrl = await client.get(customAlias);

        if (longUrl) {
            return longUrl;
        }
        const existingAlias = await Url.findOne({ customAlias});
        if (!existingAlias) {
            throw new Error("Url Does not exist");
        }

        await client.set(customAlias, existingAlias.longUrl);
        return existingAlias.longUrl;
    } catch (error) {
        throw new Error(error.message);
    }
};



