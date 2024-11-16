const BAD_REQUEST_SC = { code: 400, message: "Requested resource not found" };

const NOT_FOUND_SC = { code: 404, message: "Invalid Data" };

const SERVER_ERROR_SC = { code: 500, message: "Internal Server Error" };

module.exports = {
  BAD_REQUEST_SC,
  NOT_FOUND_SC,
  SERVER_ERROR_SC,
};
