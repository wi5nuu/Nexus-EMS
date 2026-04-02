import { PrismaClient } from '@prisma/client';
import { CreateTicketInput, UpdateTicketInput } from './tickets.schema';

const prisma = new PrismaClient();

export class TicketsService {
  async getAllTickets(projectId?: string) {
    return prisma.ticket.findMany({
      where: projectId ? { ticketProjectId: projectId } : undefined,
      include: {
        project: true,
        assignee: {
          select: { id: true, email: true }
        },
        reporter: {
          select: { id: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTicketById(id: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        project: true,
        comments: {
          include: { user: { select: { email: true } } },
          orderBy: { createdAt: 'asc' }
        },
        assignee: { select: { email: true } },
        reporter: { select: { email: true } }
      },
    });
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }

  async createTicket(reporterId: string, input: CreateTicketInput) {
    let projectId = input.ticketProjectId;

    if (!projectId) {
      // Find or create a default internal project
      const defaultProject = await prisma.ticketProject.findFirst({
        where: { key: 'NEX' }
      }) || await prisma.ticketProject.create({
        data: {
          organizationId: (await prisma.organization.findFirst())?.id || '', // Fallback to first org
          key: 'NEX',
          name: 'Vanguard Internal'
        }
      });
      projectId = defaultProject.id;
    }

    return prisma.ticket.create({
      data: {
        ...input,
        ticketProjectId: projectId,
        reporterId,
      },
      include: {
        assignee: { select: { email: true } },
        project: true,
      }
    });
  }

  async updateTicket(id: string, input: UpdateTicketInput) {
    return prisma.ticket.update({
      where: { id },
      data: input,
      include: {
        assignee: { select: { email: true } },
      }
    });
  }

  async createComment(ticketId: string, userId: string, body: string) {
    return prisma.ticketComment.create({
      data: {
        ticketId,
        userId,
        body,
      },
      include: {
        user: { select: { email: true } }
      }
    });
  }
}
