import { PrismaClient } from '@prisma/client';
import { CreateProjectInput, UpdateProjectInput } from './projects.schema';

const prisma = new PrismaClient();

export class ProjectsService {
  async getAllProjects(workspaceId?: string) {
    const projects = await prisma.project.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      include: {
        workspace: true,
        tasks: {
          select: { status: true }
        },
        _count: {
          select: { tasks: true, sprints: true },
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    return projects.map(p => {
      const total = p.tasks.length;
      const done = p.tasks.filter(t => t.status === 'DONE').length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;
      
      // Map to frontend interface needs
      return {
        ...p,
        progress,
        openTickets: p._count.tasks - done, // Approximate for now
        color: 'violet', // Static color for now
        health: progress > 80 ? 'ON_TRACK' : progress > 30 ? 'AT_RISK' : 'BLOCKED',
      };
    });
  }

  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        workspace: true,
        sprints: true,
      },
    });
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProject(input: CreateProjectInput) {
    return prisma.project.create({
      data: input,
    });
  }

  async updateProject(id: string, input: UpdateProjectInput) {
    return prisma.project.update({
      where: { id },
      data: input,
    });
  }

  async deleteProject(id: string) {
    // Requires transaction to delete associated tasks/sprints based on FK constraints realistically
    return prisma.project.delete({
      where: { id },
    });
  }
}
