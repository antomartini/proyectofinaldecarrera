import { PostProvider } from './../../providers/post-provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CargarnotificacionService {

  constructor(public postPvdr: PostProvider) { }

  private idnotificacion = new BehaviorSubject<number>(0);

  public customIdnotificacion = this.idnotificacion.asObservable();


  private notificaciones = new BehaviorSubject <any>(0);

  public customNotificaciones = this.notificaciones.asObservable();

 
  public changeIdnotificacion(id: number): void {
    this.idnotificacion.next(id);
    console.log("El nuevo valor es de: ", this.idnotificacion);
  }

 

  public changeNotificaciones(): void {

    const body = {
      aksi: 'visualizarnotificacion'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
          const json = JSON.parse(data);
          this.notificaciones.next(json.result);
          console.log("Notificaciones:" ,this.notificaciones);
      });
  }




}
