import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import { ClimaService } from 'src/app/services/clima.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnInit {

  lat: any;
  lon: any;

  weather = undefined;

  constructor(private weatherService: ClimaService,
              private geolocation: Geolocation) {
                this.weatherService.changeUbicacionNueva();
               }


  ngOnInit() {
    this.weatherService.changeUbicacionNueva();
    this.weatherService.customLatitudNueva.subscribe(msg => this.lat = msg);
    this.weatherService.customLongitudNueva.subscribe(msg => this.lon = msg);
    this.obtenerDatos();
  }

  getWeather() {

    this.weatherService
      .obtenerClima(this.lon, this.lat)
      .subscribe(
        res => {
          console.log(res);
          this.weather = res;
        },
        err => {
          console.log(err);
        }
      );
  }

  obtenerID() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve (
          this.weatherService.changeUbicacionNueva()
        );
      }, 200);
   });
  }

  async obtenerDatos() {
    const msg = await this.obtenerID();


    this.getWeather();
  }

}
