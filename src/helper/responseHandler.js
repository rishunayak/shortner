export const ResponseHandler = {
    success: (res, statusCode,data) => {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    },

    error: (res, statusCode = 500, error ) => {
        console.error("Error:", error);
        return res.status(statusCode).json({
            success: false,
            error,
        });
    }
};