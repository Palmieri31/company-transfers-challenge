export class Transfer {
  constructor(
    public id: number,
    public companyId: number,
    public amount: number,
    public debitAccount: string,
    public creditAccount: string,
    public transferDate: Date,
  ) {}
}
