import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MonitoringService } from '../monitoring/monitoring.service';

@Injectable()
export class IotGatewayService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(IotGatewayService.name);
  private readonly brokerUrl = 'mqtt://broker.hivemq.com'; // Fallback public broker
  private readonly topics = ['tekmindz/solar/+/telemetry', 'tekmindz/solar/+/alert'];

  constructor(private readonly monitoringService: MonitoringService) {}

  onModuleInit() {
    this.connectToBroker();
  }

  private connectToBroker() {
    this.client = mqtt.connect(this.brokerUrl);

    this.client.on('connect', () => {
      this.logger.log(`Connected to MQTT Broker at ${this.brokerUrl}`);
      this.subscribeToTopics();
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message);
    });

    this.client.on('error', (err) => {
      this.logger.error(`MQTT Connection Error: ${err.message}`);
    });
  }

  private subscribeToTopics() {
    this.client.subscribe(this.topics, (err) => {
      if (err) {
        this.logger.error('Failed to subscribe to topics');
      } else {
        this.logger.log(`Subscribed to: ${this.topics.join(', ')}`);
      }
    });
  }

  private handleMessage(topic: string, message: Buffer) {
    const payload = message.toString();
    this.logger.debug(`Received [${topic}]: ${payload}`);
    
    // Parse topic to get device ID
    // Topic format: tekmindz/solar/{deviceId}/{type}
    const parts = topic.split('/');
    if (parts.length === 4) {
        const deviceId = parts[2];
        const type = parts[3];
        
        if (type === 'telemetry') {
            this.processTelemetry(deviceId, JSON.parse(payload));
        } else if (type === 'alert') {
            this.processAlert(deviceId, JSON.parse(payload));
        }
    }
  }

  private async processTelemetry(deviceId: string, data: any) {
    try {
        await this.monitoringService.saveTelemetry(deviceId, data);
        this.logger.verbose(`Telemetry saved for ${deviceId}`);
    } catch (error) {
        this.logger.error(`Failed to save telemetry for ${deviceId}`, error);
    }
  }

  private processAlert(deviceId: string, data: any) {
    // Forward to NotificationsService
    this.logger.warn(`Device ${deviceId} reported alert:`, data);
  }

  public publishCommand(deviceId: string, command: string, payload: any) {
    const topic = `tekmindz/solar/${deviceId}/command`;
    this.client.publish(topic, JSON.stringify({ command, payload, timestamp: new Date() }), (err) => {
       if (err) {
           this.logger.error(`Failed to publish command to ${topic}`);
       } else {
           this.logger.log(`Command sent to ${deviceId}: ${command}`);
       }
    });
  }
}
