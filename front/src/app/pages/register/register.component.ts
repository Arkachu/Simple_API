import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private regserv: AuthService, private router: Router) {}

  ngOnInit() {}

  // Méthode pour créer un utilisateur
  createUser(email: string, password: string) {
    // On passe par des services pour créer un utilisateur dans le back
    this.regserv.createUser(email, password);
  }
}
