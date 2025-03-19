export class Company {
  constructor(
    public readonly id: number,
    public readonly cuit: string,
    public readonly businessName: string,
    public readonly adhesionDate: Date,
  ) {}
}
