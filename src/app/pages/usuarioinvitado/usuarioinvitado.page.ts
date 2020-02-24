import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { MenuController, ToastController, NavController } from '@ionic/angular';
import { Componente } from '../../interfaces/interfaces';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Platform } from '@ionic/angular';

import { Router } from '@angular/router';
// Geolocalizacion
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PostProvider } from 'src/providers/post-provider';
import { CargarnotificacionService } from 'src/app/services/cargarnotificacion.service';

@Component({
  selector: 'app-usuarioinvitado',
  templateUrl: './usuarioinvitado.page.html',
  styleUrls: ['./usuarioinvitado.page.scss'],
})
export class UsuarioinvitadoPage implements OnInit {

  componentes: Componente[] = [];

   // Nuevos Caminos Rurales
   caminos = icon({
    iconUrl: 'assets/icon/caminos.png',
    iconSize: [30, 40],
    popupAnchor: [0, -20]
  });

   // Nuevos Estados
   estados = icon({
    iconUrl: 'assets/icon/estados.png',
    iconSize: [30, 40],
    popupAnchor: [0, -20]
  });

   // Nuevos Afectaciones
   afectaciones = icon({
    iconUrl: 'assets/icon/afectaciones.png',
    iconSize: [30, 40],
    popupAnchor: [0, -20]
  });

  // Ubicación del usuario
  usuario = icon({
    iconUrl: 'assets/icon/usuario.png',
    iconSize: [40, 50],
    popupAnchor: [0, -20]
  });

  // Posicion del usuario
  lat: number;
  lon: number;
  total: string;

  // Posicion del cursor
  cursorlatitud: number;
  cursorlongitud: number;

  // Creo un objeto de tipo map
  map: Map;
  newMarker: any;
  address: string[];

  // Arreglo de notificaciones a leer
  notificaciones: Array<any>;

  notif: null;

  constructor(private menuCtrl: MenuController,
              public plt: Platform,
              public router: Router,
              public geolocation: Geolocation,
              private postPvdr: PostProvider,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public cargaNotif: CargarnotificacionService) {
              // Funcion para obtener todos los datos necesarios al iniciar
              this.obtenerDatos();
              } // Fin del Constructor

  ngOnInit() {
  }

  cargarNotificaciones() {
    const body = {
      aksi: 'visualizarnotificacion'
    };

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
          const json = JSON.parse(data);
          this.notificaciones = json.result;
          console.log('Se subscribio');
          console.log('Longitud:', this.notificaciones.length);
      });
  }

  // Visualizar las notificaciones en pantalla
  leerNotificaciones() {
    // Lee todas las notificaciones

    for (let index = 0; index < this.notificaciones.length; index++) {
      console.log(this.notificaciones[index]);
      let icono: any;
      if (this.notificaciones[index].tipo_notificacion === '1') {
        icono = this.caminos;
      } else if (this.notificaciones[index].tipo_notificacion === '2') {
        icono = this.estados;
      } else {
        icono = this.afectaciones;
      }
      const popupOptions = {
        maxWidth: '400',
        width: '200',
        className : 'custom-popup2'
      };
      const notificacion = marker([this.notificaciones[index].lat, this.notificaciones[index].lon], {icon: icono}).addTo(this.map);
      notificacion.bindPopup(this.notificaciones[index].id_notificacion);
      console.log('ID CUANDO CARGA: ', notificacion.getPopup().getContent());
      notificacion.on('click', () => this.onMarkerClicked(notificacion) );

    }

  }


  toggleMenu() {
    // si el menu esta abierto, lo cierra. Si el menu esta cerrado, lo abre;
   this.menuCtrl.toggle();
  }



 // Forma parte del proceso de IONIC
 ionViewDidEnter() {
  this.loadMap();  }

  // Cargar el mapa
  loadMap() {

    // Ubicacion de Santa Fe - Se inicializa la ubicación aquí
    this.map = new Map('map').setView([-31.6333294, -60.7000008], 25);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution:
      'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'})
        .addTo(this.map); // This line is added to add the Tile Layer to our map

    // Posicion del usuario
    this.locatePosition();

    // Notificaciones
    this.leerNotificaciones();
  }

// Función que se dispara cuando se pulsa sobre el mapa.
onMarkerClicked(notificacion: any) {
  this.navCtrl.navigateForward('/notificacion');
  const id = notificacion.getPopup().getContent();
  console.log('ID CUANDO GUARDA: ', id);
  this.cargaNotif.changeIdnotificacion(id);
}



  // Remover mapa cuando se deja la pagina
  ionViewWillLeave() {
    this.map.remove();
  }

  // Localizar posición del usuario
  locatePosition() {
    this.map.locate({setView:true}).on('locationfound',
    (e: any) => this.newMarker = marker([e.latitude, e.longitude], {icon: this.usuario}).addTo(this.map));
  }
  // Funcion asincrona para obtener las notificaciones de la bd
  obtenerNotificaciones(): Promise<any>  {
    return new Promise(resolve =>   {resolve (
        this.cargarNotificaciones()); } );

 }

  async obtenerDatos() {
   const msg = await this.obtenerNotificaciones();
  }



}
