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
}
