import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarnotificacionService {

  constructor() { }

  private idnotificacion = new BehaviorSubject<number>(0);

  public customIdnotificacion = this.idnotificacion.asObservable();


  public changeIdnotificacion(id: number): void {
    this.idnotificacion.next(id);
    console.log("El nuevo valor es de: ", this.idnotificacion);
  }

}
