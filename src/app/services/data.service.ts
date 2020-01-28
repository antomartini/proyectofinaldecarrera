import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getMenuOpts() {
    return this.http.get<Componente[]>('/assets/data/menu.json');
  }

  getFooterOpts() {
    return this.http.get<Componente[]>('/assets/data/footer.json');
  }

  getNotificacionesOpts() {
    return this.http.get<Componente[]>('/assets/data/notificaciones.json');
  }
}
