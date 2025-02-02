import { getAnalyticsService, getTopicAnalyticsService,getOverallAnalyticsService } from "../services/analyticsService.js";
import Url from "../models/urlModel.js";
import { ResponseHandler } from "../helper/responseHandler.js";
import { aliasSchema, urlTopicSchema } from "../helper/validatorSchema.js";



export const getAnalyticsController = async (req, res) => {

    const {alias} = req.params;

    const { error } = aliasSchema.validate({ alias });
     if (error) {
       return ResponseHandler.error(res, 400, error.details[0].message);
     }
    try {
        const result = await getAnalyticsService(alias);
        if (!result) {
          return ResponseHandler.error(res,404,"The specified short URL alias does not exist")
          }
        return ResponseHandler.success(res,200,result) 
    } catch (error) {
        console.error("Error in getAnalyticsController:", error.message);
    return ResponseHandler.error(
      res,
      500,
      error.message || "Internal Server Error"
    );
    }
};

export const  getTopicAnalyticsController=async(req,res)=>{
   const {topic}=req.params

   const { error } = urlTopicSchema.validate({ topic });
   if (error) {
    return ResponseHandler.error(res, 400, error.details[0].message);
}
try {
    const urls = await Url.find({ topic }); // Query URLs based on the topic field

    if (!urls || urls.length === 0) {
      return ResponseHandler.error(res,404,'No URLs found for this topic.')
    }

    const result = await getTopicAnalyticsService(topic,urls);

        return ResponseHandler.success(res,200,result) 
} catch (error) {
    console.error("Error in getTopicAnalyticsController:", error.message);
        return ResponseHandler.error(res,500,error.message||"Internal Server Error")
}
}

export const getOverallAnalyticsController=async(req,res)=>{
    try {
        let result=await getOverallAnalyticsService(req.user)
        return ResponseHandler.success(res,200,result);
    } catch (error) {
        console.error("Error in getOverallAnalyticsController:", error);
        return ResponseHandler.error(res,500,error.message||"Internal Server Error") 
    }
}