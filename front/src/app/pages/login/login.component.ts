import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private loginserv: AuthService, private router: Router) { }

  ngOnInit() { }

  // Méthode pour se connecter
  login(email: string, password: string) {
    // On passe par des services pour se connecter dans le back
    this.loginserv.login(email, password);
  }
}
