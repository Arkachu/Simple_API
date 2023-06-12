import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient, private router: Router) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  // Méthode pour récupérer les données souhaitées (ici, les utilisateurs)
  get(uri: string) {
    return this.http.get<any[]>(`${this.ROOT_URL}/${uri}`, {withCredentials: true});
  }

  // Méthode pour envoyer des données (ici, les données d'incription, de connexion et de déconnexion)
  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {withCredentials: true}).subscribe((res: any) => {
      // On récupère l'uri de la page actuelle et on redirige vers la page souhaitée
      if (uri === 'login') {
        this.router.navigate(['users']);
      } else if (uri === 'register') {
        this.router.navigate(['login']);
      } else if (uri === 'users') {
        this.router.navigate(['login']);
      }
    });
  }
}
