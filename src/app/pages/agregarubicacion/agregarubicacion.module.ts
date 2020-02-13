import { ComponentesModule } from './../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgregarubicacionPage } from './agregarubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarubicacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentesModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgregarubicacionPage]
})
export class AgregarubicacionPageModule {}
