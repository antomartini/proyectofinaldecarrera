import { PostProvider } from 'src/providers/post-provider';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
    private online: Observable<boolean> = null;
    private hasConnection = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private http: HttpClient,
        private postPvdr: PostProvider,
        public toastCtrl: ToastController) {

        if (this.platform.is('cordova')) {
            // on Device
            this.network.onConnect().subscribe(() => {
                console.log('network was connected :-)');
                this.hasConnection.next(true);
                return;
            });
            this.network.onDisconnect().subscribe(() => {
                console.log('network was disconnected :-(');
                this.hasConnection.next(false);
                return;
            });
        } else {
            // on Browser
            this.online = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false))
            );

            this.online.subscribe((isOnline) =>{
                if (isOnline) {
                    this.hasConnection.next(true);
                  console.log('network was connected :-)');
                } else {
                    console.log('network was disconnected :-(');
                    this.hasConnection.next(false);
                    console.log(isOnline);
                  }
              });
        }
        this.testNetworkConnection();
    }

    private notificaciones = new Array <any> (0);

    public agregarNotificacion(notificacion: any): void {
        this.notificaciones.push(notificacion);
    }

    public cargarNotificaciones(): void {
        let isConnected = false;
        this.getNetworkStatus().subscribe((connected: boolean) => {
            isConnected = connected;

            if (!isConnected) {
                console.log('Por favor enciende tu conexión a Internet');
            } else {
              console.log('¡CONECTADO!');
              for (const notificacion in this.notificaciones) {
                const provider: Observable <any> = this.postPvdr.postData(notificacion, '/index.php');
    
                provider.subscribe(
                 async data => {
                     console.log('Se subscribio');
                     if ( data !== null) {
                       const toast = await this.toastCtrl.create({
                         message: 'Creacion Exitosa',
                         duration: 3000
                       });
                       console.log(data);
                       toast.present();
                     } else {
                       const toast = await this.toastCtrl.create({
                         message: 'La creacion de la notificación falló',
                         duration: 3000,
                       });
                       console.log(data);
                       toast.present();
                     }
                   });
                }
            this.notificaciones = new Array <any> (0);

            }
        });

    }


    public getNetworkType(): string {
        return this.network.type;
    }

    public getNetworkStatus(): Observable<boolean> {
        return this.hasConnection.asObservable();
    }

    private getNetworkTestRequest(): Observable<any> {
        return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
    }

    public async testNetworkConnection() {
        try {
            this.getNetworkTestRequest().subscribe(
            success => {
                // console.log('Request to Google Test  success', success);
                    this.hasConnection.next(true);
                return;
            }, error => {
                // console.log('Request to Google Test fails', error);
                this.hasConnection.next(false);
                return;
            });
        } catch (err) {
            console.log('err testNetworkConnection', err);
            this.hasConnection.next(false);
            return;
       }
    }

    


}