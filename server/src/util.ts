export enum ErrorCode {
  SERVER_NOT_FOUND = "SERVER_NOT_FOUND",
  MISSING_PARAMS = "MISSING_PARAMS",
  SERVER_ALREADY_EXISTS = "SERVER_ALREADY_EXISTS",
}
const messages = {
  SERVER_NOT_FOUND: "Server was not found",
  MISSING_PARAMS: "Parameters are missing from your request"
}

export function generateError(code: ErrorCode, message?: String) {
  return {
    code,
    message: message || messages[code]
  }
}

export function checkParameters(parameters: string[]) {
  return function(req, res, next) {
    const missing = []
    for(const param of parameters) {
      if(!req.body[param]) {
        missing.push(param)
      }
    }

    if(missing.length > 0) {
      res.status(400).json({
        ...generateError(ErrorCode.MISSING_PARAMS),
        params: missing
      })
    }else{
      next()
    }
  }
}
