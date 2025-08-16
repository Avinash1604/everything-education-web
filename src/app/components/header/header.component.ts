import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName = 'Avinash';
  notificationCount = 0;
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;

  sections = ["About Everything education", "Get in touch", "Preferences"];
  items = [
    ["About us", "Privacy policy", "Terms and Conditions"],
    ["Give us feedback", "Contact support"],
    ["Notification Settings", "Membership", "Announcement", "Delete Account"]
  ];

  constructor(
    private notificationService: NotificationService,
    private session: SessionService
  ) { }

  ngOnInit(): void {
    this.loadNotificationCount();
    this.loadNotifications();
  }

  loadNotificationCount(): void {
    const user = this.session.get('authResponse');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.userId;
      if (userId) {
        this.notificationService.getNotificationCount(userId).subscribe(response => {
          this.notificationCount = response.count;
        });
      }
    }
  }

  loadNotifications(): void {
    const user = this.session.get('authResponse');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.userId;
      if (userId) {
        this.notificationService.getNotifications(userId).subscribe(response => {
          this.notifications = response.slice(0, 20);
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
            this.loadNotificationCount(); // Refresh count
          });
        }
      }
    }
  }

  closeNotificationModal(): void {
    this.selectedNotification = null;
  }
}
