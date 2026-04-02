import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AIService {
  async triageTicket(ticketId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new Error('Ticket not found');

    // Simulate AI Analysis of the ticket title and description
    const text = `${ticket.title} ${ticket.description || ''}`.toLowerCase();
    
    let suggestedPriority = 'MEDIUM';
    let suggestedLabels = ['triage-required'];
    let confidence = 0.85;

    if (text.includes('critical') || text.includes('outage') || text.includes('down') || text.includes('urgent')) {
      suggestedPriority = 'CRITICAL';
      suggestedLabels.push('incident', 'high-impact');
    } else if (text.includes('bug') || text.includes('error') || text.includes('fix')) {
      suggestedPriority = 'HIGH';
      suggestedLabels.push('bugfix');
    } else if (text.includes('feature') || text.includes('add') || text.includes('request')) {
      suggestedPriority = 'LOW';
      suggestedLabels.push('enhancement');
    }

    return {
      ticketId,
      suggestedPriority,
      suggestedLabels,
      analysis: `AI analyzed the ticket content. Keywords detected risk patterns corresponding to ${suggestedPriority} priority.`,
      confidence
    };
  }

  async generatePostmortem(ticketId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { comments: true }
    });

    if (!ticket) throw new Error('Ticket not found');

    return {
      ticketId,
      summary: `Automated Postmortem for ${ticket.title}`,
      timeline: ticket.comments.map((c: any) => `${c.createdAt.toISOString()}: ${c.body.substring(0, 50)}...`),
      rootCause: "To be determined by engineering team.",
      actionItems: [
        "Review error logs for the period.",
        "Add automated regression tests.",
        "Update documentation for the affected module."
      ]
    };
  }
}
