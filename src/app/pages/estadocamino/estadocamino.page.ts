import { NavController } from '@ionic/angular';
import { NotificacionesService } from './../../services/notificaciones.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-estadocamino',
  templateUrl: './estadocamino.page.html',
  styleUrls: ['./estadocamino.page.scss'],
})
export class EstadocaminoPage implements OnInit {

  public estados = [
    { val: 'BUENO', isChecked: false, 
    texto: 'Es un camino rural en buen estado. Es posible transitarlo sin ningún problema o consecuencia.'},
    { val: 'REGULAR', isChecked: false, 
    texto: 'Es un camino rural que tiene posibilidades de ser transitado aunque no es del todo seguro que no ocurran problemas' },
    { val: 'MALO', isChecked: false, 
    texto: 'Es un camino rural que es imposible de transitar sin la ocurrencia de problemas.' },
    { val: 'CORTADO', isChecked: false, 
    texto: 'El camino está cortado. No se encuentra disponible para ser transitado.' }
  ];


  message: string;

  constructor(private notificacionesService: NotificacionesService,
              private navCtrl: NavController) {

   }

  ngOnInit() {

  }

  validar(valor: string) {
    this.notificacionesService.changeEstado(valor);
    this.notificacionesService.customEstado.subscribe(msg => this.message = msg);
    console.log(this.message);
  }

  crearEstado() {
    this.navCtrl.navigateBack('/creacionnotificacion');
  }

}
