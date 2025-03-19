export class PaginatedResponse<T> {
  constructor(
    public data: T[],
    public total: number,
    public limit: number,
    public offset: number,
  ) {}
}
