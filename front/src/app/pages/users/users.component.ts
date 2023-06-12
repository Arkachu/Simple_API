import { Component } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

    users: any[];

    constructor(private usersServ: UsersService) {
      this.users = [];
    }

    // Méthode pour afficher la liste des utilisateurs au chargement de la page
    ngOnInit() {
      // On passe par des services pour récupérer les données dans le back
      this.usersServ.getUsers().subscribe((users: any[]) => {
        this.users = users;
      });
    }

    // Méthode pour se déconnecter
    logout() {
      this.usersServ.logout();
    }
}
