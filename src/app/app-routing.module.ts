import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: './pages/inicio/inicio.module#InicioPageModule' },
  { path: 'paginaprincipal', loadChildren: './pages/paginaprincipal/paginaprincipal.module#PaginaprincipalPageModule' },
  { path: 'creacionafectacion', loadChildren: './pages/creacionafectacion/creacionafectacion.module#CreacionafectacionPageModule' },
  { path: 'creacionnotificacion', loadChildren: './pages/creacionnotificacion/creacionnotificacion.module#CreacionnotificacionPageModule' },
  { path: 'registrousuario', loadChildren: './pages/registrousuario/registrousuario.module#RegistrousuarioPageModule' },
  { path: 'iniciosesion', loadChildren: './pages/iniciosesion/iniciosesion.module#IniciosesionPageModule' },
  { path: 'notificacion', loadChildren: './pages/notificacion/notificacion.module#NotificacionPageModule' },
  { path: 'perfilusuario', loadChildren: './pages/perfilusuario/perfilusuario.module#PerfilusuarioPageModule' },
  { path: 'estadocamino', loadChildren: './pages/estadocamino/estadocamino.module#EstadocaminoPageModule' },
  { path: 'clima', loadChildren: './pages/clima/clima.module#ClimaPageModule' },
  { path: 'preguntasfrecuentes', loadChildren: './pages/preguntasfrecuentes/preguntasfrecuentes.module#PreguntasfrecuentesPageModule' },
  { path: 'glosario', loadChildren: './pages/glosario/glosario.module#GlosarioPageModule' },
  { path: 'recomendaciones', loadChildren: './pages/recomendaciones/recomendaciones.module#RecomendacionesPageModule' },
  { path: 'historial', loadChildren: './pages/historial/historial.module#HistorialPageModule' },
  { path: 'caminonuevo', loadChildren: './pages/caminonuevo/caminonuevo.module#CaminonuevoPageModule' },
  { path: 'modificarnotificacion', loadChildren: './pages/modificarnotificacion/modificarnotificacion.module#ModificarnotificacionPageModule' },
  { path: 'usuarioinvitado', loadChildren: './pages/usuarioinvitado/usuarioinvitado.module#UsuarioinvitadoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
