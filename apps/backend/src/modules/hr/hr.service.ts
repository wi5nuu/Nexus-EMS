import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HRService {
  /**
   * Leave Management
   */
  async getLeaveBalances(userId: string) {
    return prisma.leaveBalance.findMany({
      where: { employeeId: userId },
    });
  }

  async requestLeave(userId: string, data: { type: string; startDate: Date; endDate: Date; reason?: string }) {
    // Basic validation: Check if user has a profile
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('User does not have an active employee profile');
    }

    // Create the leave request
    return prisma.leaveRequest.create({
      data: {
        employeeId: userId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: 'PENDING',
      },
    });
  }

  async listLeaveRequests(organizationId: string) {
    return prisma.leaveRequest.findMany({
      where: {
        employee: {
          user: {
            organizationId: organizationId,
          },
        },
      },
      include: {
        employee: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveLeave(requestId: string, reviewerId: string, status: 'APPROVED' | 'REJECTED') {
    return prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewerId,
      },
    });
  }

  /**
   * Attendance Management
   */
  async clockIn(userId: string, location?: any, device?: string) {
    // Check if already clocked in today (simplified)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: userId,
        clockIn: {
          gte: today,
        },
        clockOut: null,
      },
    });

    if (existing) {
      throw new Error('Already clocked in');
    }

    return prisma.attendanceRecord.create({
      data: {
        employeeId: userId,
        clockIn: new Date(),
        location,
        device,
      },
    });
  }

  async clockOut(userId: string) {
    const record = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: userId,
        clockOut: null,
      },
      orderBy: { clockIn: 'desc' },
    });

    if (!record) {
      throw new Error('No active clock-in found');
    }

    return prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        clockOut: new Date(),
      },
    });
  }

  async getMyAttendanceHistory(userId: string) {
    return prisma.attendanceRecord.findMany({
      where: { employeeId: userId },
      orderBy: { clockIn: 'desc' },
      take: 30,
    });
  }

  /**
   * Employee Directory & Management
   */
  async listEmployees(organizationId: string) {
    return prisma.user.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        employeeProfile: {
          include: {
            department: true,
            team: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listTeams(organizationId: string) {
    return prisma.team.findMany({
      where: {
        department: {
          organizationId,
        },
      },
      include: {
        department: true,
        _count: {
          select: { employees: true }
        }
      }
    });
  }

  async listTeamMembers(teamId: string) {
    return prisma.employeeProfile.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          }
        },
        department: true,
      }
    });
  }

  async updateEmployee(userId: string, data: { status?: string; jobTitle?: string; departmentId?: string; teamId?: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Update User status if provided
      if (data.status) {
        await tx.user.update({
          where: { id: userId },
          data: { status: data.status as any },
        });
      }

      // 2. Update Employee Profile
      const profileData: any = {};
      if (data.jobTitle) profileData.jobTitle = data.jobTitle;
      if (data.departmentId) profileData.departmentId = data.departmentId;
      if (data.teamId !== undefined) profileData.teamId = data.teamId;

      const profile = await tx.employeeProfile.update({
        where: { userId },
        data: profileData,
        include: {
          department: true,
          team: true,
        }
      });

      return profile;
    });
  }

  async getEmployeeById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        employeeProfile: {
          include: {
            department: true,
            team: true,
          }
        },
      },
    });
  }

  async createEmployee(organizationId: string, data: { email: string; firstName: string; lastName: string; jobTitle: string; departmentId?: string; teamId?: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the base User
      const user = await tx.user.create({
        data: {
          organizationId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          status: 'ACTIVE',
        }
      });

      // 2. Create the Employee Profile
      const profile = await tx.employeeProfile.create({
        data: {
          userId: user.id,
          jobTitle: data.jobTitle,
          departmentId: data.departmentId,
          teamId: data.teamId,
          joinDate: new Date(),
        }
      });

      return { ...user, employeeProfile: profile };
    });
  }
}
