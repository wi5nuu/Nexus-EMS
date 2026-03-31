import { Kafka, Producer, Consumer } from 'kafkajs';

const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

export class KafkaEventStream {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(clientId: string, groupId: string) {
    this.kafka = new Kafka({
      clientId,
      brokers: KAFKA_BROKERS,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log(`[Kafka] Connected successfully to ${KAFKA_BROKERS}`);
    } catch (error) {
      console.error('[Kafka] Connection error:', error);
    }
  }

  async publish(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.error(`[Kafka] Publish error to topic ${topic}:`, error);
    }
  }

  async subscribe(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
          callback(JSON.parse(message.value.toString()));
        }
      },
    });
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}

// Global Singleton for general service events
export const kafkaStream = new KafkaEventStream('nexus-backend', 'nexus-events-group');
