import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private roleSubject = new BehaviorSubject<string>(sessionStorage.getItem('role') || '');
  role = this.roleSubject.asObservable();

  updateRole(role: string): void {
    sessionStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  clearRole(): void {
    sessionStorage.removeItem('role');
    this.roleSubject.next('');
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}