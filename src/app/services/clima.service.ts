import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  apiKey: string = '05525ba676bad19c17607d074b9bc88f';
  URI: string = '';

  lat: number;
  lon: number;

  private latitudNueva = new BehaviorSubject<number> (0);
  private longitudNueva = new BehaviorSubject<number> (0);
  public customLatitudNueva = this.latitudNueva.asObservable();
  public customLongitudNueva = this.longitudNueva.asObservable();

  constructor(private http: HttpClient,
              private geolocation: Geolocation) {

    this.URI = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}`;
 }

  obtenerClima(lon: number, lat: number) {
    this.lat = lat;
    console.log(this.lat);
    this.lon = lon;
    console.log(this.lon);
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  public changeUbicacionNueva() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      this.latitudNueva.next(resp.coords.latitude);
      this.longitudNueva.next(resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    return 1;
  }

}

