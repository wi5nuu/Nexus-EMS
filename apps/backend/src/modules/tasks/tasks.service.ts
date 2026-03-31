import { PrismaClient } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from './tasks.schema';

const prisma = new PrismaClient();

export class TasksService {
  async getTasksByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignees: {
          include: { user: true }
        },
        sprint: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async getTaskById(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: {
          include: { user: true }
        },
        project: true,
        sprint: true,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async createTask(reporterId: string, input: CreateTaskInput) {
    const { assigneeIds, ...taskData } = input;

    return prisma.task.create({
      data: {
        ...taskData,
        reporterId,
        assignees: {
          create: assigneeIds?.map((userId) => ({
            userId,
          })) || [],
        },
      },
      include: {
        assignees: true,
      },
    });
  }

  async updateTask(taskId: string, input: UpdateTaskInput) {
    const { assigneeIds, ...taskData } = input;

    // Use transaction if we need to update assignees
    if (assigneeIds !== undefined) {
      return prisma.$transaction(async (tx) => {
        // Delete old assignees
        await tx.taskAssignee.deleteMany({
          where: { taskId },
        });

        // Update task and create new assignees
        return tx.task.update({
          where: { id: taskId },
          data: {
            ...taskData,
            assignees: {
              create: assigneeIds.map((userId) => ({
                userId,
              })),
            },
          },
          include: {
            assignees: true,
            sprint: true,
          },
        });
      });
    }

    // Simple update
    return prisma.task.update({
      where: { id: taskId },
      data: taskData,
      include: {
        assignees: true,
        sprint: true,
      },
    });
  }

  async deleteTask(taskId: string) {
    // Delete all linked assignees first due to FK constraint
    await prisma.taskAssignee.deleteMany({
      where: { taskId }
    });

    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}
