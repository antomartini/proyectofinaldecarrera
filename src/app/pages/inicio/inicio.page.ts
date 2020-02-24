import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  signUp(){
    this.navCtrl.navigateRoot('/registrousuario');
    }

    signIn() {
      this.navCtrl.navigateRoot('/iniciosesion');
    }

    usuarioinvitado() {
      this.navCtrl.navigateRoot('/usuarioinvitado');
    }
}
