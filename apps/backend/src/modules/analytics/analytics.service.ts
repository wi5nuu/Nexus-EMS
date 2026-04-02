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

    return {
      recentTickets,
      averageTicketResolutionTime: "2.4h", // Mock for now
      slaCompliance: "94%" // Mock for now
    };
  }
}
