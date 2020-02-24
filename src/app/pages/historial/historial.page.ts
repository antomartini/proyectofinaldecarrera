
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from 'src/providers/post-provider';
import { ToastController, NavController } from '@ionic/angular';
import { CargarnotificacionService } from 'src/app/services/cargarnotificacion.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {


  // Usuario del Historial
  usuario: string;


  // Arreglo de notificaciones a leer
  notificaciones;

  constructor(
    public router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public cargaNotif: CargarnotificacionService,
    public storage: Storage) {
        this.obtenerDatos();
     }


  ngOnInit() {
  }

  cargarHistorial() {
    // Json necesario para obtener las notificaciones de la bd

    const body = {
      usuario: this.usuario,
      aksi: 'historialdenotificaciones'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
        console.log(data);
        const json = JSON.parse(data);
        this.notificaciones = json.result;
      } )
  }

  obtenerID() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve (
          this.storage.get('inicio_sesion').then((val) => {
            this.usuario = val;
          }),
        );
      }, 200);
   });
  }

  async obtenerDatos() {
    const msg = await this.obtenerID();
    console.log(this.usuario)

    this.cargarHistorial();
  }

  eliminar(id: number) {
    console.log('id que manda al sql: ',id);
    const body = {
      id_notificacion: id,
      aksi: 'eliminarnotificacion'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
        console.log('Elimino la notificacion');
      } )

  }

  modificar(id: number) {
  this.cargaNotif.changeIdnotificacion(id);
  this.navCtrl.navigateForward('/modificarnotificacion');
  }

  visualizarnotificacion(id: number) {

  this.cargaNotif.changeIdnotificacion(id);
  this.navCtrl.navigateForward('/notificacion');

  }
}
