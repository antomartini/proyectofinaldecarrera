


import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, NavController } from '@ionic/angular';
import { Componente } from '../../interfaces/interfaces';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Platform } from '@ionic/angular';

import { Router } from '@angular/router';
// Geolocalizacion
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PostProvider } from 'src/providers/post-provider';
import { CargarnotificacionService } from 'src/app/services/cargarnotificacion.service';
import { Storage } from '@ionic/storage';

import * as L from 'leaflet';

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
 notificaciones: any;

 notif: null;

 banderanotificaciones: boolean = false;



 constructor(private menuCtrl: MenuController,
             public plt: Platform,
             public router: Router,
             public geolocation: Geolocation,
             private postPvdr: PostProvider,
             public toastCtrl: ToastController,
             public navCtrl: NavController,
             public cargaNotif: CargarnotificacionService,
             private storage: Storage) {

             // Funcion para obtener todos los datos necesarios al iniciar
             // this.obtenerDatos();
             this.cargaNotif.changeNotificaciones();
             this.cargaNotif.customNotificaciones.subscribe(msg => this.notificaciones = msg);
             console.log("Notificaciones: " , this.notificaciones);
             // GUARDAR DATOS LOCALMENTE
             this.storage.set('notificaciones', this.notificaciones );
             } // Fin del Constructor

 ngOnInit() {
   this.cargaNotif.changeNotificaciones();
   this.cargaNotif.customNotificaciones.subscribe(msg => this.notificaciones = msg);

 }

 // Visualizar las notificaciones en pantalla
 leerNotificaciones() {

   if (this.notificaciones === null || this.notificaciones === 0 ) {
     this.storage.get('notificaciones').then((val) => {
       console.log('Storage: ', val);
       this.notificaciones = val; 
     });

   }
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
 this.loadMap();
  }

 // Cargar el mapa
 loadMap() {

   // Ubicacion de Santa Fe - Se inicializa la ubicación aquí
   this.map = L.map('map').setView([-31.6333294, -60.7000008], 25);

   tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
   { attribution:
     'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'})
       .addTo(this.map); // This line is added to add the Tile Layer to our map
   
   // Posicion del usuario
   this.locatePosition();

   // Notificaciones
   this.leerNotificaciones();

   var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
           '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
           'Imagery © <a href="http://mapbox.com">Mapbox</a>',
         mbUrl = 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';

   var comun = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
     Urlcomun = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


     var Attr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
     Url = 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}';

   var grayscale   = tileLayer(mbUrl, {id: 'map.light', attribution: mbAttr}),
          satelital = tileLayer(Url, {id: 'map.streets',   attribution: Attr}),
           standar  = tileLayer(Urlcomun, {id: 'map.streets',   attribution: comun});

       var baseLayers = {
         "Estandar": standar,
         "Escala en Grises": grayscale,
         "Satelital": satelital
       };

       L.control.layers(baseLayers).addTo(this.map);

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




}
