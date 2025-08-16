import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationCount {
  count: number;
}

export interface Notification {
  id: number;
  name: string;
  text: string;
  sortOrder: number;
  type: string;
  enabled: boolean;
  read: boolean;
  createdOn: string;
  updatedOn: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.apiUrl}/api/v1/notification`;

  constructor(private http: HttpClient) { }

  getNotificationCount(userId: string): Observable<NotificationCount> {
    return this.http.get<NotificationCount>(`${this.apiUrl}/count?userId=${userId}`);
  }

  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}?userId=${userId}`);
  }

  updateNotificationReadStatus(announcementId: number, userId: string): Observable<any> {
    const body = { read: true, annoucementId: announcementId, userId: userId };
    return this.http.post(`${this.apiUrl}/updateAnnoucementRead`, body);
  }
}
