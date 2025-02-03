import { ResponseHandler } from "../helper/responseHandler.js";
import { aliasSchema, urlShortenerSchema } from "../helper/validatorSchema.js";
import {
  getShortenUrlService,
  urlShortnerService,
} from "../services/urlService.js";

export const urlShortnerController = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  const { error } = urlShortenerSchema.validate(req.body);
  if (error) {
    return ResponseHandler.error(res, 400, error.details[0].message);
  }
  try {
    const result = await urlShortnerService(
      longUrl,
      customAlias,
      topic,
      req.user
    );
    return ResponseHandler.success(res, 200, result);
  } catch (error) {
    console.error("Error in urlShortnerController :", error.message);
    return ResponseHandler.error(
      res,
      500,
      error.message || "Internal Server Error"
    );
  }
};

export const getShortenUrlController = async (req, res) => {
  const { alias } = req.params;
  const { error } = aliasSchema.validate({ alias });
  if (error) {
    return ResponseHandler.error(res, 400, error.details[0].message);
  }
  let userAgentString = req.headers["user-agent"]; // Get user agent from request
  const userId = req.ip;
  try {
    const result = await getShortenUrlService(alias, userAgentString, userId);

    return res.redirect(result);
  } catch (error) {
    console.error("Error in getShortenUrlController:", error.message);
    return ResponseHandler.error(
      res,
      500,
      error.message || "Internal Server Error"
    );
  }
};
