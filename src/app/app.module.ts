// Servicios creados
import { NotificacionesService } from './services/notificaciones.service';
import { DataService } from './services/data.service';
import { CargarnotificacionService } from './services/cargarnotificacion.service';

import { PostProvider } from './../providers/post-provider';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentesModule } from './componentes/componentes.module';

// Para la conexion a la base de datos
import { HttpClientModule } from '@angular/common/http';

// Providers
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicStorageModule } from '@ionic/storage';

// Llamar a Modo Produccion
enableProdMode();

// environment
import { environment } from '../environments/environment';

// Guardar Imagen en Angular Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
  
  ],
  // Generalmente todo lo que sea Module, va en esta parte
  // Esto es para que la aplicacion sepa que existen estos modulos
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentesModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    PostProvider,
    DataService,
    NotificacionesService,
    Camera,
    AngularFireStorage,
    Geolocation,
    AngularFirestore,
    CargarnotificacionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
