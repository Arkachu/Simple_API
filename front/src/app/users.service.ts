import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private webReqServ: WebRequestService) { }

  getUsers(){
    return this.webReqServ.get('users');
  }

  logout() {
    return this.webReqServ.post('users', {});
  }
}
