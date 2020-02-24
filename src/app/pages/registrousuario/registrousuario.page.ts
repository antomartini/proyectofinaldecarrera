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
  fecha_nacimiento =  new Date();
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

  localidades: Array<string> = ['VIRGINIA',
  '	ALDAO	- CASTELLANOS	',
  '	ANGELICA	- CASTELLANOS	',
  '	ATALIVA	- CASTELLANOS	',
  '	AURELIA	- CASTELLANOS	',
  '	BAUER Y SIGEL	- CASTELLANOS	',
  '	BELLA ITALIA	- CASTELLANOS	',
  '	BIGAND	- CASTELLANOS	',
  '	CAVOUR	- LAS COLONIAS	',
  '	CELLO	- CASTELLANOS	',
  '	CELLO	- CASTELLANOS	',
  '	CLUCELLAS	- CASTELLANOS	',
  '	CNIA. MARGARITA	- CASTELLANOS	',
  '	COL BICHA	- CASTELLANOS	',
  '	COL CASTELLANOS	- CASTELLANOS	',
  '	COL CASTELLANOS	- CASTELLANOS	',
  '	CULULU	- LAS COLONIAS	',
  '	EGUSTIZA	- CASTELLANOS	',
  '	ELISA	- LAS COLONIAS	',
  '	EMPALME SAN CARLOS	- LAS COLONIAS	',
  '	ESMERALDA	- CASTELLANOS	',
  '	ESPERANZA	- LAS COLONIAS	',
  '	EST CLUCELLAS	- CASTELLANOS	',
  '	EUSEBIA	- CASTELLANOS	',
  '	EUSEBIA	- CASTELLANOS	',
  '	EUSTOLIA	- CASTELLANOS	',
  '	FELICIA	- LAS COLONIAS	',
  '	FIDELA	- CASTELLANOS	',
  '	FRAGA	- CASTELLANOS	',
  '	FRANCK	- LAS COLONIAS	',
  '	FRONTERA	- CASTELLANOS	',
  '	FRONTERA	- CASTELLANOS	',
  '	GALISTEO	- CASTELLANOS	',
  '	GARIBALDI	- CASTELLANOS	',
  '	GRUTLY	- LAS COLONIAS	',
  '	HIPATIA	- LAS COLONIAS	',
  '	HUGENTOBLER	- CASTELLANOS	',
  '	HUMBERTO 1	- CASTELLANOS	',
  '	HUMBOLT	- LAS COLONIAS	',
  '	HUMBOLT	- LAS COLONIAS	',
  '	ITURRASPE	- CASTELLANOS	',
  '	ITUZAANGO	- LAS COLONIAS	',
  '	JACINTO L ARAUZ	- LAS COLONIAS	',
  '	JOSEFINA	- CASTELLANOS	',
  '	LA PELADA	- LAS COLONIAS	',
  '	LAS TUNAS	- LAS COLONIAS	',
  '	LEHMANN	- CASTELLANOS	',
  '	LEHMANN	- CASTELLANOS	',
  '	MARIA JUANA	- CASTELLANOS	',
  '	MARIA JUANA	- CASTELLANOS	',
  '	MARIA LUISA	- LAS COLONIAS	',
  '	MARINI	- CASTELLANOS	',
  '	MATILDE	- LAS COLONIAS	',
  '	MATILDE	- LAS COLONIAS	',
  '	MAUA	- CASTELLANOS	',
  '	NUEVO TORINO	- LAS COLONIAS	',
  '	PILAR	- LAS COLONIAS	',
  '	PROGRESO	- LAS COLONIAS	',
  '	PROVIDENCIA	- LAS COLONIAS	',
  '	PTE ROCA	- CASTELLANOS	',
  '	PTE ROCA	- CASTELLANOS	',
  '	PUJATO NORTE	- LAS COLONIAS	',
  '	RAFAELA	- CASTELLANOS	',
  '	RAFAELA	- CASTELLANOS	',
  '	RAFAELA	- CASTELLANOS	',
  '	RAFAELA	- CASTELLANOS	',
  '	RAMONA	- CASTELLANOS	',
  '	RAQUEL 	- CASTELLANOS	',
  '	RIVADAVIA	- LAS COLONIAS	',
  '	S C DE SAGUIER	- CASTELLANOS	',
  '	SAA PEREYRA	- LAS COLONIAS	',
  '	SAGUIER	- CASTELLANOS	',
  '	SAGUIER	- CASTELLANOS	',
  '	SAN AGUSTIN	- LAS COLONIAS	',
  '	SAN ANTONIO	- CASTELLANOS	',
  '	SAN CARLOS CENTRO	- LAS COLONIAS	',
  '	SAN CARLOS NORTE	- LAS COLONIAS	',
  '	SAN CARLOS SUR	- LAS COLONIAS	',
  '	SAN GERONIMO DEL SAUCE	- LAS COLONIAS	',
  '	SAN GERONIMO NORTE	- LAS COLONIAS	',
  '	SAN JOSE	- LAS COLONIAS	',
  '	SAN MARIANO	- LAS COLONIAS	',
  '	SAN VICENTE	- CASTELLANOS	',
  '	SAN VICENTE	- CASTELLANOS	',
  '	SANTO DOMINGO	- LAS COLONIAS	',
  '	SARMIENTO	- LAS COLONIAS	',
  '	SOUTOMAYOR	- LAS COLONIAS	',
  '	STA CLARA DE B VISTA	- LAS COLONIAS	',
  '	STA MARIA CENTRO	- LAS COLONIAS	',
  '	STA MARIA NORTE	- LAS COLONIAS	',
  '	SUNCHALES	- CASTELLANOS	',
  '	SUSANA	- CASTELLANOS	',
  '	TACURALES	- CASTELLANOS	',
  '	TACURAÑ	- CASTELLANOS	',
  '	VILA	- CASTELLANOS	',
  '	VILLA SAN JOSE	- CASTELLANOS	',
  '	VIRGINIA	- CASTELLANOS	',
  '	ZENON PEREYRA	- CASTELLANOS	',
  '	ZENON PEREYRA	- CASTELLANOS	',
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
  ];

  ngOnInit() {

  // Opciones en el popup de las fechas
    this.customPickerOptions = {
      buttons: [{
        text: 'Guardar',
        handler: (event) => {
        console.log(event);
        this.fecha_nacimiento.setDate(event.day.value);
        this.fecha_nacimiento.setFullYear(event.year.value);
        this.fecha_nacimiento.setMonth(event.month.value);
        console.log('Fecha: ', this.fecha_nacimiento);
        }
      }, {
        text: 'Cancelar',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    };
  }


  async registrarse() {
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

} // Fin de la clase
