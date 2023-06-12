import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webReqServ: WebRequestService) { }

  login(email: string, password: string) {
    return this.webReqServ.post('login', { email, password });
  }

  createUser(email: string, password: string) {
    return this.webReqServ.post('register', { email, password });
  }
}
