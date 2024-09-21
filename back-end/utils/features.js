export const successStatus = (res, message, statusCode, extra) => {
    message = message || "Successful Request";
    statusCode = statusCode || 200;
    extra = extra || null;
    if(!(extra === null)) {
        return res.status(statusCode).json({
            success: true,
            message,
            data: extra,
        });
    }
    res.status(statusCode).json({
        success: true,
        message,
    });
}