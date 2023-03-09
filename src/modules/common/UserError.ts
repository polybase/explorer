export class UserError extends Error {
  constructor(
    msg: string,
  ) {
    super(msg)
    Object.setPrototypeOf(this, UserError.prototype)
  }
}
