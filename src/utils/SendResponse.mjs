import { response } from 'express';

class SendResponse {
  success(res = response, statusCode, message, data, extra = {}) {
    return res.status(statusCode).json({
      message,
      data,
      success: true,
      ...extra,
    });
  }

  error(res = response, statusCode, message, extra = {}) {
    return res.status(statusCode).json({
      message,
      error: true,
      ...extra,
    });
  }
}

export default new SendResponse();
