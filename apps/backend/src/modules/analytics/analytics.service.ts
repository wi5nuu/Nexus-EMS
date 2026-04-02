import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getKpis(organizationId: string) {
    const [totalUsers, openTickets, totalProjects, activeSprints] = await Promise.all([
      prisma.user.count({ where: { organizationId } }),
      prisma.ticket.count({ 
        where: { 
          project: { organizationId },
          status: { not: 'CLOSED' } 
        } 
      }),
      prisma.project.count({
        where: { workspace: { organizationId } }
      }),
      prisma.sprint.count({
        where: { 
          status: 'ACTIVE',
          project: { workspace: { organizationId } }
        }
      })
    ]);

    return {
      totalUsers,
      openTickets,
      totalProjects,
      activeSprints,
      timestamp: new Date().toISOString()
    };
  }

  async getSprintHealth(sprintId: string) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        tasks: true
      }
    });

    if (!sprint) throw new Error('Sprint not found');

    const totalPoints = sprint.tasks.reduce((acc: number, t: any) => acc + (t.storyPoints || 0), 0);
    const completedPoints = sprint.tasks
      .filter((t: any) => t.status === 'DONE')
      .reduce((acc: number, t: any) => acc + (t.storyPoints || 0), 0);

    return {
      sprintName: sprint.name,
      totalPoints,
      completedPoints,
      progress: totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0,
      taskCount: sprint.tasks.length,
      completedTaskCount: sprint.tasks.filter((t: any) => t.status === 'DONE').length
    };
  }

  async getOrganizationInsights(organizationId: string) {
    // Logic for high-level executive insights
    const recentTickets = await prisma.ticket.findMany({
      where: { project: { organizationId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { reporter: true }
    });

    const ticketTrend = await this.getTicketTrendData(organizationId);

    return {
      recentTickets,
      ticketTrend,
      averageTicketResolutionTime: "2.4h", // Mock for now
      slaCompliance: "94%" // Mock for now
    };
  }

  private async getTicketTrendData(organizationId: string) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [reported, resolved] = await Promise.all([
        prisma.ticket.count({
          where: {
            project: { organizationId },
            createdAt: { gte: date, lt: nextDate }
          }
        }),
        prisma.ticket.count({
          where: {
            project: { organizationId },
            status: 'RESOLVED',
            updatedAt: { gte: date, lt: nextDate }
          }
        })
      ]);

      trend.push({
        name: days[date.getDay()],
        reported,
        resolved
      });
    }

    return trend;
  }
}
