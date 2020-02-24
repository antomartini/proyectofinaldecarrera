import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private estado = new BehaviorSubject<string>('En espera de un estado');
  private afectacion = new BehaviorSubject<string>('En espera de un afectacion');
  private latitudNueva = new BehaviorSubject<number> (0);
  private longitudNueva = new BehaviorSubject<number> (0);


  public customEstado = this.estado.asObservable();
  public customAfectacion = this.afectacion.asObservable();
  public customLatitudNueva = this.latitudNueva.asObservable();
  public customLongitudNueva = this.longitudNueva.asObservable();

  constructor() { }

  public changeEstado(est: string): void {
    this.estado.next(est);
  }
  
  public changeAfectacion(afec: string): void {
    this.afectacion.next(afec);
  }

  public changeUbicacionNueva(lat: number, lon: number): void {
    this.latitudNueva.next(lat);
    this.longitudNueva.next(lon);
  }


  


}
