import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrganizationService {
  async getDetails(id: string) {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  async updateDetails(id: string, data: { name?: string; slug?: string }) {
    return prisma.organization.update({
      where: { id },
      data,
    });
  }

  async getDepartments(organizationId: string) {
    return prisma.department.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            employees: true,
            teams: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
  }

  async getSalaryBands(organizationId: string) {
    return prisma.salaryBand.findMany({
      where: { organizationId },
      orderBy: {
        minSalary: 'asc',
      }
    });
  }
}
