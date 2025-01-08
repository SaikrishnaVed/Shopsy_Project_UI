import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private roleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  role = this.roleSubject.asObservable();

  updateRole(role: string): void {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  clearRole(): void {
    localStorage.removeItem('role');
    this.roleSubject.next('');
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}