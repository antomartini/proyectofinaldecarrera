import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-creacionafectacion',
  templateUrl: './creacionafectacion.page.html',
  styleUrls: ['./creacionafectacion.page.scss'],
})
export class CreacionafectacionPage implements OnInit {

  // Tipo de Afectacion creada por el usuario
  afectacion: string;

  constructor(public navCtrl: NavController,
              public notificacionesService: NotificacionesService) { }

  ngOnInit() {
  }

  public afectaciones = [
    { val: 'Alambrado', isChecked: false, 
    texto: 'Rotura o tapadas por presencia de vegetación producto del paso de agua'},
    { val: 'Alcantarilla/Boca de tormenta', isChecked: false, 
    texto: 'Rotura u obstrucción por sedimentos, vegetación o basura' },
    { val: 'Animales', isChecked: false, 
    texto: 'En caso de estar en el agua o muertos.' },
    { val: 'Puente', isChecked: false, 
    texto: 'Rotura, colapso o presencia de agua, ramas o sedimentos sobre el mismo. Tablas en mal estado, cabeceras en peligro de derrumbe y sin barandas.' },
    { val: 'Señalización', isChecked: false, 
    texto: 'En los caminos pavimentados se encuentra deteriorada. En los caminos de tierra la señalización es precaria o casi inexistente.' },
    { val: 'Vegetación', isChecked: false, 
    texto: 'Árboles caídos, ramas rotas, cultivos anegados.' },
    { val: 'Anegamientos', isChecked: false, 
    texto: 'Acumulación temporal de agua de lluvia en un determinado sector.' }
  ];


  validar(valor: string) {
    this.notificacionesService.changeAfectacion(valor);
    this.notificacionesService.customAfectacion.subscribe(msg => this.afectacion = msg);
    console.log(this.afectacion);
  }

  crearAfectacion() {
    this.navCtrl.navigateBack('/creacionnotificacion');
  }
}
