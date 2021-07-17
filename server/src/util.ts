export enum ErrorCode {
  SERVER_NOT_FOUND = "SERVER_NOT_FOUND",
  MISSING_PARAMS = "MISSING_PARAMS",
  SERVER_ALREADY_EXISTS = "SERVER_ALREADY_EXISTS",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  RCON_UNAVAILABLE = "RCON_UNAVAILABLE",
}
const messages = {
  SERVER_NOT_FOUND: "Server was not found",
  MISSING_PARAMS: "Parameters are missing from your request",
  UNAUTHORIZED: "No active account session",
  RCON_UNAVAILABLE: "Server could not be reached"
}

export function generateError(code: ErrorCode, message?: String) {
  return {
    code,
    message: message || messages[code],
    error: true
  }
}

//Checks if parameters exist on req.body, pass in array of names. Pass a 2d array for OR
//[ ['a', 'b'] ] will need either a OR b
// ['a', 'b' ] will require both a AND b
export function checkParameters(parameters: (string | string[])[]) {
  return function(req, res, next) {
    const missing = []
    for(const param of parameters) {
      if(Array.isArray(param)) {
        let hasOne = false
        for(const orParam of param) {
          if(req.body[orParam]) {
            hasOne = true
            break
          }
        }
        if(!hasOne) {
          missing.push(param)
        }
      }else if(!req.body[param]) {
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

export function requireAuth(req, res, next) {
  if(!req.session || !req.session.user) return res.status(401).json(generateError(ErrorCode.UNAUTHORIZED))
  next()
}
