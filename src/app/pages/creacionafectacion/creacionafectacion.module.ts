import { ComponentesModule } from './../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreacionafectacionPage } from './creacionafectacion.page';

const routes: Routes = [
  {
    path: '',
    component: CreacionafectacionPage
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
  declarations: [CreacionafectacionPage]
})
export class CreacionafectacionPageModule {}
