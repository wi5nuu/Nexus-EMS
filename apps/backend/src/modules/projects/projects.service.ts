import { PrismaClient } from '@prisma/client';
import { CreateProjectInput, UpdateProjectInput } from './projects.schema';

const prisma = new PrismaClient();

export class ProjectsService {
  async getAllProjects(workspaceId?: string) {
    return prisma.project.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      include: {
        workspace: true,
        _count: {
          select: { tasks: true, sprints: true },
        },
      },
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
