import { PostProvider } from './../../../../../src/providers/post-provider';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CargarnotificacionService } from 'src/app/services/cargarnotificacion.service';

import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  logoprovincia = './aplicacionmovil/src/assets/icon/logo_provincia.png';
  iconoapp = '/proyectofinal/aplicacionmovil/src/assets/icon/icono_app.png';
  afectaciones = '/proyectofinal/aplicacionmovil/src/assets/icon/afectaciones.png';


  constructor(public navCtrl: NavController,
              public notificaciones: CargarnotificacionService,
              public facebook: Facebook,
              public googlePlus: GooglePlus
          ) {
                this.notificaciones.changeNotificaciones();
              }

  ngOnInit() {
  }

  user: any = {};
  showUser: boolean = false;

  signUp(){
    this.navCtrl.navigateRoot('/registrousuario');
    }

    signIn() {
      this.navCtrl.navigateRoot('/iniciosesion');
    }

    usuarioinvitado() {
      this.navCtrl.navigateRoot('/usuarioinvitado');

      const body = {
        aksi: 'conexion'
      };

     
    }

    ingresarFacebook() {
      this.facebook.login(['public_profile', 'email'])
      .then(rta => {
        console.log(rta.status);
        if (rta.status === 'connected') {
          this.getInfo();
        };
      })
      .catch(error => {
        console.error( error );
      });
    }

    getInfo() {
      this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
      .then(data => { 
        console.log(data);
        this.showUser = true; 
        this.user = data;
      })
      .catch(error =>{
        console.error( error );
      });
    }

    ingresarGoogle() {
      this.googlePlus.login({})
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }

}
