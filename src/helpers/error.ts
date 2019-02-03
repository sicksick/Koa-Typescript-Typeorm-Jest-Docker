export default class CustomError {
  message: string | object;
  status: number;

  constructor(status: number = 500, message?: string | object) {
    if (message) this.message = {error: message};
    if (status) this.status = status;
  }
}
