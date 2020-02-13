import { ComponentesModule } from './../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModificarnotificacionPage } from './modificarnotificacion.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarnotificacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentesModule
  ],
  declarations: [ModificarnotificacionPage]
})
export class ModificarnotificacionPageModule {}
