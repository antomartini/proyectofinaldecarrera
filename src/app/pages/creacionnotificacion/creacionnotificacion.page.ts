import { Storage } from '@ionic/storage';
import { NotificacionesService } from './../../services/notificaciones.service';
import { DataService } from './../../services/data.service';
import { Componente } from './../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

// Geolocalizacion
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

// Camara
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PostProvider } from 'src/providers/post-provider';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFireStorage} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConexionService } from 'src/app/services/conexion.service';



// Variable global para las imagenes capturadas
declare var window: any;

export interface Image {
  id: string;
  image: string;
}

@Component({
  selector: 'app-creacionnotificacion',
  templateUrl: './creacionnotificacion.page.html',
  styleUrls: ['./creacionnotificacion.page.scss'],
})



export class CreacionnotificacionPage implements OnInit {

// Para elegir las diferentes opciones de notificacion

  componentes: Observable<Componente[]>;

   // Posicion del usuario
   lat: number = 0;
   lon: number = 0;
   // Imagen a capturar / galeria
   imagen: any;

  // Estado del Camino relevado
  estado: string;
  // Afectacion del Camino relevado
  afectacion: string;
  // Camino nuevo relevado
  lon_desembocadura: number;
  lat_desembocadura: number;

  // Tipo de Notificacion
  tipo_notificacion: number;

  // Descripcion
  descripcion: string;

  // Fecha
  customPickerOptions: any;
  fecha_creacion= new Date();

  // Usuario que crea las notificaciones
  usuario: string;

  url: any;
  newImage: Image = {
    id: this.afs.createId(), image: ''
  }
  loading: boolean = false;

  img: any;

  isConnected = false;

  constructor(public geolocation: Geolocation,
              private camera: Camera,
              private dataService: DataService,
              private notificacionService: NotificacionesService,
              private postPvdr: PostProvider,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public stora: Storage,
              private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private networkService: ConexionService
              ) {

                this.stora.get('inicio_sesion').then((val) => {
                  console.log('usuario', val);
                  this.usuario = val;
                  console.log(this.usuario);
                });

                // Opciones en el popup de las fechas
                this.customPickerOptions = {
                    buttons: [{
                      text: 'Guardar',
                      handler: (event) => {
                      console.log('Clicked Save!');
                      console.log(event);
                      this.fecha_creacion.setDate(event.day.value);
                      this.fecha_creacion.setFullYear(event.year.value);
                      this.fecha_creacion.setMonth(event.month.value);
                      console.log("Fecha: ", this.fecha_creacion);
                      }
                    }, {
                      text: 'Cancelar',
                      handler: () => {
                        console.log('Clicked Log. Do not Dismiss.');
                        return false;
                      }
                    }]
                  }
}

  ngOnInit() {
    // Opciones de Notificaciones
    this.componentes = this.dataService.getNotificacionesOpts();
  }

  // Obtener ubicacion del Usuario
  agregarUbicacionActual() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      this.notificacionService.changeUbicacionNueva(this.lat, this.lon);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  // Agregar otra ubicación para cargar la notificación
  agregarOtraUbicacion() {
    this.navCtrl.navigateForward('/agregarubicacion');
  }

  // Cuando se inicializa la vista, se inicializa el mapa
  ionViewWillEnter() {
  this.notificacionService.customLatitudNueva.subscribe(msg => this.lat = msg);
  this.notificacionService.customLongitudNueva.subscribe(msg => this.lon = msg);
  }

  // Capturar una imagen con la camara del dispositivo
  async getPicture(event) {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 100, // calidad de la imagen,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    const resultado = await this.camera.getPicture(options).then( (imageData) => {
      console.log(imageData);
      this.img = imageData;
    })
    .catch(error => {
      console.error( error );
    });

    this.uploadImage(event);

  }


 // Agregar imagen desde galeria
  async agregarImagen(event) {

    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 100, // calidad de la imagen,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    await this.camera.getPicture(options).then( (imageData) => {
      this.img = imageData;

    })
    .catch(error => {
      console.error( error );
    });

    var blob = new Blob([this.img], { type: 'image/jpeg' });

    const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
    const result = this.SaveImageRef(filePath, blob);
    const ref = result.ref;
    result.task.then(a => {
        ref.getDownloadURL().subscribe( a => {
          this.newImage.image = a;
          this.imagen = a;
        });

         this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
     });

  }

  procesarImagen( options: CameraOptions, event) {

    var img: any;
    this.camera.getPicture(options).then( (imageData) => {
      console.log(imageData);
      img = imageData;
    })
    .catch(error => {
      console.error( error );
    });

    this.loading = true;
    const reader = new FileReader();

    reader.readAsDataURL(img);
    // For Preview Of Image
    reader.onload = (e: any) => { // called once readAsDataURL is completed
      this.url = e.target.result;

      // For Uploading Image To Firebase
      const fileraw = event.target.files[0];
      console.log(fileraw)
      const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
      const result = this.SaveImageRef(filePath, fileraw);
      const ref = result.ref;
      result.task.then(a => {
        ref.getDownloadURL().subscribe( a => {
          console.log(a);
          this.newImage.image = a;
          this.loading = false;
          this.imagen = a;
        });

        this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
      });
    }, error => { alert('Error'); }

  } // Fin de la funcion


  tipoNotificacion(ruta: string) {
     if (ruta === '/estadocamino') {
      this.tipo_notificacion = 2;
     } else if (ruta === '/caminonuevo') {
       this.tipo_notificacion = 1;
     } else { this.tipo_notificacion = 3; }
     console.log(this.tipo_notificacion);
 } // fin de funcion


 async crearNotificacion() {

  console.log("La fecha es:", this.fecha_creacion);

  // Valor de la notificacion creada depende del tipo
  this.notificacionService.customEstado.subscribe(msg => this.estado = msg);
  console.log(this.estado);
  this.notificacionService.customAfectacion.subscribe(msg => this.afectacion = msg);
  console.log(this.afectacion);
  this.notificacionService.customLatitudCamino.subscribe(msg => this.lat_desembocadura = msg);
  console.log(this.lat_desembocadura);
  this.notificacionService.customLongitudCamino.subscribe(msg => this.lon_desembocadura = msg);

  // Descripcion de la notificacion
  console.log(this.descripcion);

  // Validacion de los campos

  if (this.fecha_creacion === undefined) {
      const toast = await this.toastCtrl.create({
        message: 'El campo de fecha es requerido',
        duration: 3000
      });
      toast.present();
  } else if ( this.lat === null || this.lon === null ) {
      const toast = await this.toastCtrl.create({
        message: 'La ubicacion es requerida',
        duration: 3000
      });
      toast.present();
  } else if ( this.imagen === null ) {
      const toast = await this.toastCtrl.create({
        message: 'La imagen es requerida para crear la notificación',
        duration: 3000
      });
      toast.present();
  } else if ( this.estado === '' ) {
    const toast = await this.toastCtrl.create({
      message: 'Se debe seleccionar un tipo de notificacion',
      duration: 3000
    });
    toast.present();
} else {
    console.log(this.imagen);

  

    const body = {
      fecha_creacion: this.fecha_creacion,
      lon: this.lon,
      lat: this.lat,
      imagen: this.imagen,
      descripcion: this.descripcion,
      tipo_notificacion: this.tipo_notificacion,
      estado: this.estado,
      afectacion: this.afectacion,
      usuario: this.usuario,
      lon_desembocadura: this.lon_desembocadura,
      lat_desembocadura: this.lat_desembocadura,
      aksi: 'notificacionnueva'
    };

    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
          this.stora.set('notificacion', body);
          this.networkService.agregarNotificacion(body);
      } else {
        console.log('¡CONECTADO!');
      }
  });


    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
          console.log('Se subscribio');
          if ( data !== null) {
            this.navCtrl.navigateForward(['/paginaprincipal']);
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
}

uploadImage(event) {

  this.loading = true;
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    // For Preview Of Image
    reader.onload = (e: any) => { // called once readAsDataURL is completed
      this.url = e.target.result;

      // For Uploading Image To Firebase
      const fileraw = event.target.files[0];
      console.log(fileraw)
      const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
      const result = this.SaveImageRef(filePath, fileraw);
      const ref = result.ref;
      result.task.then(a => {
        ref.getDownloadURL().subscribe( a => {
          console.log(a);
          this.newImage.image = a;
          this.loading = false;
          this.imagen = a;
        });

        this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
      });
    }, error => { alert('Error'); }

  }
}



SaveImageRef(filePath, file) {
  return {
    task: this.storage.upload(filePath, file)
    , ref: this.storage.ref(filePath),
  };
}



}

