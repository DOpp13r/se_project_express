const BAD_REQUEST_SC = { code: 400, message: "Requested resource not found" };
const UNAUTHORIZED_SC = { code: 401, message: "Unauthorized" };
const FORBIDDEN_SC = { code: 403, message: "Forbidden" };
const NOT_FOUND_SC = { code: 404, message: "Invalid Data" };
const DUPLICATE_ERROR_SC = { code: 409, message: "Email already exists" };
const SERVER_ERROR_SC = { code: 500, message: "Internal Server Error" };

module.exports = {
  BAD_REQUEST_SC,
  UNAUTHORIZED_SC,
  FORBIDDEN_SC,
  NOT_FOUND_SC,
  DUPLICATE_ERROR_SC,
  SERVER_ERROR_SC,
};
