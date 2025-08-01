/* eslint-disable indent */
import kafka, { KafkaClient, Offset, Producer, Consumer } from 'kafka-node';
import { KafkaEvent } from '../@types';
import { processEvent } from '../controllers/process-events';
class Kafka {
     _kafka: typeof kafka;
     client: KafkaClient;
     offset: Offset;
     producer: Producer;
     Consumer: typeof Consumer;

     constructor() {
          this._kafka = kafka;
          this.client =
               process.env.NODE_ENV === 'production'
                    ? new this._kafka.KafkaClient({
                           kafkaHost: process.env.KAFKA_HOST!,
                           sasl: {
                                mechanism: 'plain',
                                username: '5KOONEXIB3PQ5IAQ',
                                password: 'ciw4dys7rSGRO6jmbrbGs2iEv+iNJ3I4YfBjQT9lIp8fsOkUCojscqE6sPtvbE5g',
                           },
                           sslOptions: {
                                rejectUnauthorized: false,
                           },
                      })
                    : new this._kafka.KafkaClient({
                           kafkaHost: process.env.KAFKA_HOST!,
                      });
          this.offset = new this._kafka.Offset(this.client);
          this.producer = new this._kafka.Producer(this.client);
          this.Consumer = this._kafka.Consumer;
     }

     async sendPayload(message: any, topic: string, partition: number = 0) {
          try {
               const payload = [
                    {
                         topic,
                         messages: JSON.stringify(message),
                         // partition: partition,
                    },
               ];
               return new Promise((res, rej) => {
                    this.producer.send(payload, (err, data) => {
                         if (err) throw new Error((err as Error).message);
                         return res(data);
                    });
                    this.producer.on('error', function (err) {
                         return rej((err as Error).message);
                    });
               });
          } catch (e) {
               throw new Error((e as Error).message);
          }
     }

     async receivePayload(topic: string, partition: number = 0) {
          try {
               const consumer = new this.Consumer(
                    this.client,
                    [
                         {
                              topic,
                              // partition,
                         },
                    ],
                    {
                         autoCommit: true,
                         fetchMaxWaitMs: 1000,
                         groupId: 'consumer-group',
                    },
               );
               return new Promise((res, rej) => {
                    consumer.on('message', async function (data) {
                         const kafka_event = (await JSON.parse((data as { [key: string]: any }).value)) as KafkaEvent;
                         return res(await processEvent(kafka_event));
                    });
                    consumer.on('error', function (err) {
                         return rej((err as Error).message);
                    });
               });
          } catch (err) {
               throw new Error((err as Error).message);
          }
     }

     async topicAvailability(topic: string) {
          return new Promise((res, rej) => {
               this.client.loadMetadataForTopics([topic], (err, resp) => {
                    if (resp) {
                         return res(true);
                    } else {
                         return rej(false);
                    }
               });
          });
     }

     latestOffset(topic: string, partition: number = 0) {
          try {
               return new Promise((resolve, reject) => {
                    this.offset.fetchLatestOffsets([topic], function (error, offsets) {
                         if (error) {
                              return reject(error);
                         }
                         return resolve(offsets[topic][partition]);
                    });
               });
          } catch (error) {
               throw new Error((error as Error).message);
          }
     }
}

export default new Kafka();
