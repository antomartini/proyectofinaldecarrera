import { NotificacionesService } from 'src/app/services/notificaciones.service';

import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Componente } from '../../interfaces/interfaces';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// Geolocalizacion
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-modificarubicacion',
  templateUrl: './modificarubicacion.page.html',
  styleUrls: ['./modificarubicacion.page.scss'],
})
export class ModificarubicacionPage implements OnInit {

  componentes: Componente[] = [];

  // Creo un objeto de tipo map
  map: Map;

  // Posicion del Usuario
  newMarker: any;

  // Nuevos Caminos Rurales
   caminos = icon({
    iconUrl: 'assets/icon/caminos.png',
    iconSize: [30, 40],
    popupAnchor: [0, -20]
  });

  // Posicion del usuario
  usuario = icon({
    iconUrl: 'assets/icon/usuario.png',
    iconSize: [40, 50],
    popupAnchor: [0, -20]
  });

  // Posicion del usuario
  lat: number;
  lon: number;
  total: string;

 // Posicion que quiere agregar
  latitudnotif: number;
  longitudnotif: number;

 // Marcador para la posicion nueva
 tempMarker: any;

  constructor(private menuCtrl: MenuController,
              public plt: Platform,
              public router: Router,
              public geolocation: Geolocation,
              public notificacionService: NotificacionesService,
              public navCtrl: NavController) {
                this.getGeolocation();
                this.latitudnotif = this.lat;
                this.longitudnotif = this.lon;
              }

  ngOnInit() {

    
  }

  // Para obtener la ubicación actual del usuario
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      console.log('Latitud del usuario: ', this.lat);
      console.log('Longitud del usuario: ', this.lon);
    });
  }

  // Cuando se inicializa la vista, se inicializa el mapa
  ionViewWillEnter() {
     this.leafletMap();
  }

  // Funcion que crea el mapa
  leafletMap() {
    // new Map() es usada para inicializar un nuevo mapa
    // setView es usada para configurar la vista del mapa
    console.log('Crea el mapa');
    // Ubicacion de Santa Fe
    this.map = new Map('mapaubicacionnueva').setView([-31.6333294, -60.7000008], 25);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Agregar notificaciones
    this.locatePosition();
    // Funcion que agrega/selecciona ubicacion que clickea el usuario
    this.map.on('click', (e) => { this.onMapClick(e) } );

  }

  // Función que se dispara cuando se pulsa sobre el mapa.
  onMapClick(e) {
    this.tempMarker = marker( e.latlng , { icon: this.caminos, draggable: true }).addTo(this.map);
    this.latitudnotif = e.latlng['lat'];
    this.longitudnotif = e.latlng['lng'];
    this.tempMarker.on('dragend', () => {
      const position = this.tempMarker.getLatLng();
      console.log(position);
      if (position !== null) {
      this.latitudnotif = position['lat'];
      this.longitudnotif = position['lng']; }
     });
    console.log(e.latlng);

    // Agregar ubicacion
    this.notificacionService.changeUbicacionNueva(this.latitudnotif, this.longitudnotif);
  }

  // Confirmar ubicacion seleccionada
  confirmarUbicacion() {
    this.navCtrl.navigateBack('\modificarnotificacion');
    console.log('Ya hizo click');
  }

  // Remover mapa cuando se deja la pagina
  ionViewWillLeave() {
    this.map.remove();
  }

  locatePosition() {
    this.map.locate({setView: true}).on('locationfound', (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {icon: this.usuario}).addTo(this.map);
      this.newMarker.bindPopup('¡Estás aquí!').openPopup();

      this.newMarker.on('dragend', () => {
        const position = this.newMarker.getLatLng();
       });

      this.map.setView([e.latitude, e.longitude], 15);
    });
  }


}
