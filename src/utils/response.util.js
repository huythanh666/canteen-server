const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
const sendError = (res, message, statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  });
};

const throwError = ({ message, statusCode }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
export { sendError, sendSuccess, throwError };
