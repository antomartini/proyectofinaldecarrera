import { PostProvider } from 'src/providers/post-provider';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
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
        public toastCtrl: ToastController,
        private sqlite: SQLite) {

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

        // SQL LITE
        this.initializeDatabase();
    }

    // Base de Datos
    private database: SQLiteObject;

    // Notificaciones a cargar
    private notificaciones = new Array <any> (0);

    private async initializeDatabase() {
        // Crear Base de Datos
        this.sqlite.create({
          name: 'Offline',
          location: 'default',
          key: 'password'
        }).then((db: SQLiteObject) => {
          this.database = db;
          db.executeSql(
            // tslint:disable-next-line: max-line-length
            'CREATE TABLE IF NOT EXISTS Notificaciones(fecha_creacion, lon, lat, imagen, descripcion,tipo_notificacionestado,afectacion,usuario,lon_desembocadura,lat_desembocadura, aksi)', [])
            .then(() => console.log('Successfully created software table.'))
              .catch(e => console.log(e));
          }).catch(e => console.log(e));
    }

    public agregarNotificacion(notificacion: any): void {
        this.notificaciones.push(notificacion);

          // Insertar datos en la base de datos local :
        this.database.transaction((tx) => {
        // tslint:disable-next-line: max-line-length
        tx.executeSql("INSERT INTO Notificaciones(fecha_creacion, lon, lat, imagen, descripcion,tipo_notificacionestado,afectacion,usuario,lon_desembocadura,lat_desembocadura, aksi)', [])", 
        // tslint:disable-next-line: max-line-length
        [notificacion.fecha_creacion, notificacion.lon, notificacion.lat, notificacion.imagen, notificacion.descripcion,notificacion.tipo_notificacionestado,notificacion.afectacion,notificacion.usuario,notificacion.lon_desembocadura,notificacion.lat_desembocadura, notificacion.aksi], (tx, result) => {
            console.log('insertId: ' + result.insertId);  // New Id number
            console.log('rowsAffected: ' + result.rowsAffected);  // 1
        });
        });

        let isConnected = false;
        this.getNetworkStatus().subscribe((connected: boolean) => {
            isConnected = connected;

            if (!isConnected) {
                console.log('Por favor enciende tu conexión a Internet');
            } else {
              console.log('¡CONECTADO!');
            }
        });

    }

    public cargarNotificaciones(): void {

      this.database.transaction((tx) => {
        tx.executeSql('SELECT * from Notificaciones', [], (tx, result) => {
            for (let i = 0; i < result.rows.length; i++) {
              console.log(result.rows.item(i));
              // Se extrae una notificación a cargar
              const provider: Observable <any> = this.postPvdr.postData(result.rows.item(i), '/index.php');
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
          });
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