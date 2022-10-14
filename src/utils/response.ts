import { StatusCodes } from 'http-status-codes';

export default class Response {
  public constructor(
    private code: StatusCodes,
    private message: string,
    private data?: any
  ) {}

  public getCode(): number {
    return Number(this.code);
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): any {
    return this.data;
  }
}
