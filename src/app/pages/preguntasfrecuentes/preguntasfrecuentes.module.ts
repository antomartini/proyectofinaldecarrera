import { ComponentesModule } from './../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PreguntasfrecuentesPage } from './preguntasfrecuentes.page';

const routes: Routes = [
  {
    path: '',
    component: PreguntasfrecuentesPage
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
  declarations: [PreguntasfrecuentesPage]
})
export class PreguntasfrecuentesPageModule {}
