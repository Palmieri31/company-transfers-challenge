import { Company } from '@/domains/company';

describe('Company', () => {
  it('should create a company with the correct properties', () => {
    const id = 1;
    const cuit = '20123456789';
    const businessName = 'Test Company';
    const adhesionDate = new Date('2025-03-18');

    const company = new Company(id, cuit, businessName, adhesionDate);

    expect(company.id).toBe(id);
    expect(company.cuit).toBe(cuit);
    expect(company.businessName).toBe(businessName);
    expect(company.adhesionDate).toBe(adhesionDate);
  });
});
