const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };
  if (data !== null) {
    response.total = Array.isArray(data) ? data.length : undefined;
    response.data = data;
  }
  return res.status(statusCode).send(response);
};

const handlerError = (res, error, message = "Internal Server Error") => {
  console.log(error);
  return res.status(500).send({
    success: false,
    message,
    error: error.message,
  });
};

module.exports = {
  sendResponse,
  handlerError,
};
