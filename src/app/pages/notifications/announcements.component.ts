import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;

  constructor(
    private notificationService: NotificationService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const user = this.session.get('authResponse');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.userId;
      if (userId) {
        this.notificationService.getNotifications(userId).subscribe(response => {
          this.notifications = response;
        });
      }
    }
  }

  openNotification(notification: Notification): void {
    this.selectedNotification = notification;
    if (!notification.read) {
      const user = this.session.get('authResponse');
      if (user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser?.userId;
        if (userId) {
          this.notificationService.updateNotificationReadStatus(notification.id, userId).subscribe(() => {
            notification.read = true;
          });
        }
      }
    }
  }

  closeNotificationModal(): void {
    this.selectedNotification = null;
  }
}
