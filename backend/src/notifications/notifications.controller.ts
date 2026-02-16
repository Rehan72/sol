import { Controller, Get, Put, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@Req() req, @Query('unreadOnly') unreadOnly?: string) {
    return this.notificationsService.findAllForUser(req.user.id, unreadOnly === 'true');
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put('read-all')
  async markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Post('test-alert')
  async triggerTestAlert(@Body() body: { message: string }) {
    // Valid UUID for testing
    return this.notificationsService.triggerSystemAlert('4cc365db-053d-4cd4-8012-cb0358ac0310', 'Test Alert', body.message, 'CRITICAL');
  }
}
