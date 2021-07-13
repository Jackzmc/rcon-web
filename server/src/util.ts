export enum ErrorCode {
  SERVER_NOT_FOUND = "SERVER_NOT_FOUND"
}
const messages = {
  "SERVER_NOT_FOUND": "Server was not found"
}

export function generateError(code: ErrorCode, message?: String) {
  return {
    code,
    message: message || messages[code]
  }
}
