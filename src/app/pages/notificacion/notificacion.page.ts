import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Component, OnInit } from '@angular/core';
import { CargarnotificacionService } from 'src/app/services/cargarnotificacion.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {

  descripcion: string;
  idnotificacion: any;
  fechacreacion: any;
  lon: any;
  lat: any;
  imagen: any;
  tiponotificacion: any;
  usuario: any;
  notificaciontipo: any;

  // Comentarios de otra notificacion
  comentarios: any;
  // Comentario
  comentario: any;

  // Valoración de la notificacion
  valor: any;

  notificacioncargada: any;
  constructor(public cargarNotif: CargarnotificacionService,
              private postPvdr: PostProvider,
              public toastCtrl: ToastController) {
    this.cargarNotif.customIdnotificacion.subscribe(msg => this.idnotificacion = msg);
    this.obtenerDatos();
    this.visualizarComentarios();
  }

  ngOnInit() {
  }

  extraerNotificacion() {

    console.log('id cuando va a leer: ', this.idnotificacion);
    const body = {
      id: this.idnotificacion,
      aksi: 'leernotificacion'
    };

    console.log(this.idnotificacion);
    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
        const dataconver = JSON.parse(data);
        console.log(dataconver);
        this.notificacioncargada = dataconver.result;
        this.usuario = dataconver.usuario;
        this.notificaciontipo = dataconver.notificacion;
        this.imagen = this.notificacioncargada[0].imagen;
        this.descripcion = this.notificacioncargada[0].descripcion;
        this.idnotificacion = this.notificacioncargada[0].idnotificacion;
        this.fechacreacion = this.notificacioncargada[0].fechacreacion;
        this.lon = this.notificacioncargada[0].lon;
        this.lat = this.notificacioncargada[0].lat;
        this.imagen = this.notificacioncargada[0].imagen;
        this.tiponotificacion = this.notificacioncargada[0].tiponotificacion;
        });

  } // Fin de la funcion


  obtenerID() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve (
          this.cargarNotif.customIdnotificacion.subscribe(msg => this.idnotificacion = msg),
        );
      }, 200);
   });
  }

  async obtenerDatos() {
    const msg = await this.obtenerID();
    this.extraerNotificacion();
  }

  // Comentar la notificacion
  comentar() {
    this.cargarNotif.customIdnotificacion.subscribe(msg => this.idnotificacion = msg);

    const body = {
      id: this.idnotificacion,
      comentario: this.comentario,
      aksi: 'comentarnotificacion'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');
    provider.subscribe(
      async data => {
          const toast = await this.toastCtrl.create({
            message: 'Se guardó el comentario correctamente',
            duration: 3000,
          });
      });

    this.visualizarComentarios();
  }

  visualizarComentarios() {

    this.cargarNotif.customIdnotificacion.subscribe(msg => this.idnotificacion = msg);
    const body = {
      id: this.idnotificacion,
      aksi: 'leercomentarios'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
        const dataconver = JSON.parse(data);
        console.log('data:', dataconver);
        this.comentarios = dataconver.result;
        console.log(this.comentarios);
        if ( dataconver.registro === '1') {
            const toast = await this.toastCtrl.create({
              message: 'Creacion Exitosa',
              duration: 3000
            });
          }
        });
  }

  valorar() {
    console.log(this.valor);
    this.cargarNotif.customIdnotificacion.subscribe(msg => this.idnotificacion = msg);
    console.log('id: ', this.idnotificacion);
    const body = {
      id: this.idnotificacion,
      valor: this.valor,
      aksi: 'valorar'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
            const toast = await this.toastCtrl.create({
              message: '¡Tu valoraciòn se guardo!',
              duration: 3000
            });
            toast.present();
        });
  }

}
