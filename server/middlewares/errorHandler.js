// middlewares/errorHandler.js

export const errorHandler= async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: err.message || 'Internal Server Error',
    });

    console.error(err.stack);
}


