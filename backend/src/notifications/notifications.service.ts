import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationChannel } from '../entities/notification.entity';
import { PushNotificationService } from './push-notification.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly pushService: PushNotificationService
  ) {}

  async send(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    channels: NotificationChannel[] = [NotificationChannel.SYSTEM],
    metadata?: any,
  ) {
    const notifications = [];

    for (const channel of channels) {
      // Save to database regardless of channel for history
      const notification = this.notificationRepo.create({
        userId,
        title,
        message,
        type,
        channel,
        metadata,
      });

      const savedNotification = await this.notificationRepo.save(notification);
      notifications.push(savedNotification);

      // Trigger external channels
      if (channel === NotificationChannel.EMAIL) {
        await this.sendEmail(userId, title, message);
      } else if (channel === NotificationChannel.SMS) {
        await this.sendSMS(userId, message);
      } else if (channel === NotificationChannel.WHATSAPP) {
        await this.sendWhatsApp(userId, message);
      }
    }

    return notifications;
  }

  async findAllForUser(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) {
        where.isRead = false;
    }
    return this.notificationRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string) {
    await this.notificationRepo.update(notificationId, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async triggerSystemAlert(userId: string, title: string, message: string, priority: 'HIGH' | 'CRITICAL' = 'HIGH') {
    // High priority alert that bypasses standard filters and triggers system-wide notification
    
    // Trigger Push Notification Mock
    if (priority === 'CRITICAL') {
        await this.pushService.sendNotificationToUser(userId, title, message);
    }

    return this.send(
        userId,
        `[${priority}] ${title}`,
        message,
        priority === 'CRITICAL' ? NotificationType.ALERT : NotificationType.WARNING,
        [NotificationChannel.SYSTEM, NotificationChannel.EMAIL],
        { priority, autoTriggered: true }
    );
  }

  // Placeholder methods for external integrations
  private async sendEmail(userId: string, title: string, message: string) {
    console.log(`[Email] Sending to user ${userId}: ${title} - ${message}`);
    // Integrate with SendGrid, AWS SES, etc.
  }

  private async sendSMS(userId: string, message: string) {
    console.log(`[SMS] Sending to user ${userId}: ${message}`);
    // Integrate with Twilio, MessageBird, etc.
  }

  private async sendWhatsApp(userId: string, message: string) {
    console.log(`[WhatsApp] Sending to user ${userId}: ${message}`);
    // Integrate with Twilio WhatsApp API, Wati, etc.
  }
}
