import Joi from "joi";

export const urlShortenerSchema = Joi.object({
    longUrl: Joi.string().uri().required().messages({
        "string.uri": "Invalid URL format",
        "any.required": "longUrl is required",
    }),
    customAlias: Joi.string().alphanum().min(5).max(8).optional().messages({
        "string.alphanum": "customAlias must be alphanumeric",
        "string.min": "customAlias must be at least 5 characters long",
        "string.max": "customAlias cannot be more than 8 characters",
    }),
    topic: Joi.string().min(4).optional().messages({
        "string.min": "topic must be at least 4 characters long",
    }),
});


export const aliasSchema = Joi.object({
    alias: Joi.string().alphanum().min(5).max(8).required().messages({
        "string.alphanum": "Alias must be alphanumeric",
        "string.min": "Alias must be at least 5 characters long",
        "string.max": "Alias cannot be more than 8 characters",
        "any.required": "Alias is required",
    }),
});

export const urlTopicSchema = Joi.object({
    topic: Joi.string().min(4).required().messages({
        "string.min": "Topic must be at least 4 characters long",
        "any.required": "Topic is required",
    }),
});
