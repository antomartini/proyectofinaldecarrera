import { Observable } from 'rxjs';
import { Component, OnInit} from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-registrousuario',
  templateUrl: './registrousuario.page.html',
  styleUrls: ['./registrousuario.page.scss'],
})
export class RegistrousuarioPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  usuario: string = '';
  password: string = '';
  fecha_nacimiento: any = '';
  actividad_economica: string = '';
  confirm_password: string = '';
  localidad: string = '';
  departamento: string = '';
  correoelectronico: string = '';

  // Opciones de Fecha
  customPickerOptions: any;

  // declaracion de variables
  constructor(
    public navCtrl: NavController,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private storage: Storage
  ) { }

  localidadesCastellanos: Array<string> = ['VIRGINIA',
    'MAUA - Castellanos ',
    'HUMBERTO 1 - Castellanos ',
    'RAQUEL - Castellanos',
    'TACURAÑ - Castellanos',
    'TACURALES - Castellanos',
    'COL BICHA - Castellanos',
    'EUSEBIA - Castellanos',
    'HUGENTOBLER - Castellanos',
    'ALDAO - Castellanos',
    'SUNCHALES - Castellanos',
    'ATALIVA - Castellanos',
    'GALISTEO - Castellanos',
    'LEHMANN - Castellanos',
    'EGUSTIZA - Castellanos',
    'BIGAND - Castellanos',
    'FIDELA - Castellanos',
    'MARINI - Castellanos',
    'RAMONA - Castellanos',
    'FRAGA - Castellanos',
    'VILA - Castellanos',
    'COL CASTELLANOS - Castellanos',
    'PTE ROCA - Castellanos',
    'RAFAELA - Castellanos',
    'BELLA ITALIA - Castellanos',
    'AURELIA - Castellanos',
    'SUSANA - Castellanos',
    'VILLA SAN JOSE - Castellanos',
    'SAGUIER - Castellanos',
    'SAN ANTONIO - Castellanos',
    'S C DE SAGUIER - Castellanos',
    'BAUER Y SIGEL - Castellanos',
    'JOSEFINA - Castellanos',
    'CELLO - Castellanos',
    'CLUCELLAS - Castellanos',
    'ITURRASPE - Castellanos',
    'ANGELICA - Castellanos',
    'EST CLUCELLAS - Castellanos',
    'EUSTOLIA - Castellanos',
    'ZENON PEREYRA - Castellanos',
    'FRONTERA - Castellanos',
    'ESMERALDA - Castellanos',
    'GARIBALDI - Castellanos',
    'MARIA JUANA - Castellanos',
    'CNIA. MARGARITA - Castellanos',
    'SAN VICENTE - Castellanos'
  ];

  localidadesLasColonias: Array<string> = [
    'ELISA - Las Colonias ',
    'JACINTO L ARAUZ - Las Colonias',
    'LA PELADA - Las Colonias',
    'ITUZAANGO - Las Colonias',
    'SOUTOMAYOR - Las Colonias',
    'PROVIDENCIA - Las Colonias',
    'MARIA LUISA - Las Colonias',
    'SANTO DOMINGO - Las Colonias',
    'PROGRESO - Las Colonias',
    'HIPATIA - Las Colonias',
    'SARMIENTO - Las Colonias',
    'FELICIA - Las Colonias',
    'GRUTLY - Las Colonias',
    'RIVADAVIA - Las Colonias',
    'CULULU - Las Colonias',
    'ESPERANZA - Las Colonias',
    'CAVOUR - Las Colonias',
    'HUMBOLT - Las Colonias',
    'NUEVO TORINO - Las Colonias',
    'PILAR - Las Colonias',
    'STA MARIA CENTRO - Las Colonias',
    'STA MARIA NORTE - Las Colonias',
    'SAN GERONIMO NORTE - Las Colonias',
    'LAS TUNAS - Las Colonias',
    'PUJATO NORTE - Las Colonias',
    'FRANCK - Las Colonias',
    'EMPALME SAN CARLOS - Las Colonias',
    'SAN JOSE - Las Colonias',
    'SAN AGUSTIN - Las Colonias',
    'SAN CARLOS NORTE - Las Colonias',
    'SAN GERONIMO DEL SAUCE - Las Colonias',
    'SAN PEREYRA - Las Colonias',
    'SAN MARIANO - Las Colonias',
    'STA CLARA DE B VISTA - Las Colonias',
    'SAN CARLOS CENTRO - Las Colonias',
    'MATILDE - Las Colonias',
    'SAN CARLOS SUR - Las Colonias',
  ];

  actividades: Array<string> = [
    'Producción Agrícola',
    'Producción Forestal',
    'Producción Aromática',
    'Producción Florícola',
    'Producción Frutícola',
    'Producción Hortícola',
    'Producción Bovina Carne',
    'Producción Bovina Lechera',
    'Producción Apícola',
    'Producción Avícola',
    'Producción Caprina',
    'Producción Ovina',
    'Producción Porcina',
    'Producción Bubalina',
    'Producción Equina',
    'Producción Cunicola',
    'Producción Icticola',
    'Producción Camélidos',
    'Transportista de Producción',
    'Ciclista',
    'Ciudadano/a',
    'Municipios',
    'Escuela',
    'Centro de Salud',
    'Comuna'
  ]

  ngOnInit() {
  
  // Opciones en el popup de las fechas
    this.customPickerOptions = {
      buttons: [{
        text: 'Guardar',
        handler: (event) => { 
        console.log('Clicked Save!');
        console.log(event);
        this.fecha_nacimiento = new Date().setDate(event.day.value);
        this.fecha_nacimiento = new Date().setFullYear(event.year.value);
        this.fecha_nacimiento = new Date().setMonth(event.month.value);
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
  

  async prosesRegister() {
    // Validacion de los campos
    if (this.usuario === '') {
        const toast = await this.toastCtrl.create({
          message: 'El nombre de usuario es requerido',
          duration: 3000
        });
        toast.present();
    } else if ( this.password === '') {
        const toast = await this.toastCtrl.create({
          message: 'La contraseña es requerida',
          duration: 3000
        });
        toast.present();
    } else if ( this.password !== this.confirm_password ) {
        const toast = await this.toastCtrl.create({
          message: 'Contraseña inválida',
          duration: 3000
        });
        toast.present();
    } else {

      console.log(this.localidad);
      console.log(this.departamento);

      const body = {
        nombre: this.nombre,
        apellido: this.apellido,
        usuario: this.usuario,
        password: this.password,
        fecha_nacimiento: this.fecha_nacimiento,
        actividad_economica: this.actividad_economica,
        localidad: this.localidad,
        departamento: this.departamento,
        correoelectronico: this.correoelectronico,
        aksi: 'register'
      };
      console.log(body);

      const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

      provider.subscribe(
        async data => {
          // GUARDAR DATOS LOCALMENTE
          this.storage.set('inicio_sesion', this.usuario );
          this.storage.get('inicio_sesion').then((val) => {
            console.log('Nombre de usuario', val);
          });
          console.log('Se suscribio');
          const dataconver = JSON.parse(data);
          console.log(dataconver);
          if ( dataconver.registro === '1') {
              this.navCtrl.navigateRoot(['/paginaprincipal']);
              const toast = await this.toastCtrl.create({
                message: 'Registro Exitoso',
                duration: 3000
              });
              toast.present();
            } else {
              const toast = await this.toastCtrl.create({
                message: 'El registro falló',
                duration: 3000,
              });

              toast.present();
            }

          });

    }
  }

} // fin de la clase
