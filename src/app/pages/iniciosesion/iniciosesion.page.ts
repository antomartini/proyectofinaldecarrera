import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

// Para la conexion a la base de datos
import { PostProvider } from 'src/providers/post-provider';


@Component({
  selector: 'app-iniciosesion',
  templateUrl: './iniciosesion.page.html',
  styleUrls: ['./iniciosesion.page.scss'],
})

export class IniciosesionPage implements OnInit {

  usuario: string = '';
  password: string = '';
 
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public postPvdr: PostProvider,
              private storage: Storage
              ) {
  }

  ngOnInit() {
  }

  async prosesLogin() {

    // Si los campos usuario/contraseña no estan vacios
    if ( this.usuario !== '' && this.password !== '') {

      // Cuerpo del json
      const body = {
        usuario: this.usuario,
        password: this.password,
        aksi: 'login'
      };

      const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

      provider.subscribe(async data => {
      // Si data no es null
          const json = JSON.parse(data);
          console.log(json.inicio);
          if (json.inicio === '1') {

            // GUARDAR DATOS LOCALMENTE
            this.storage.set('inicio_sesion', this.usuario );
            this.storage.get('inicio_sesion').then((val) => {
              console.log('Nombre de usuario', val);
            });

            // Se redirige a la pagina principal
            this.navCtrl.navigateRoot(['/paginaprincipal']);
            const toast = await this.toastCtrl.create({
            message: 'Ha iniciado sesion',
            duration: 2000
            });
            toast.present();
            this.usuario = '';
            this.password = '';
            console.log(data);
          } else {
            const toast = await this.toastCtrl.create({
            message: 'Credenciales inválidas',
            duration: 2000 });
            console.log(data);
            console.log(json.inicio);
            toast.present();
          }
      });

    } else {
      const toast = await this.toastCtrl.create({
      message: 'Usuario o contraseña inválida',
      duration: 2000
    });
      toast.present();
    }
  } //fin de la funcion login

}
