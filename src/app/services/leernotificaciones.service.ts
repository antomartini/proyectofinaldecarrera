import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeernotificacionesService {

  private notificaciones = new BehaviorSubject<any> (0);

  public customNotificaciones = this.notificaciones.asObservable();


  constructor() { }

  public changeEstado(arreglo: any): void {
    this.notificaciones.next(arreglo);
  }
}
