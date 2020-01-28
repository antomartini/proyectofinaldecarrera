import { Storage } from '@ionic/storage';
import { NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PostProvider } from 'src/providers/post-provider';

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.page.html',
  styleUrls: ['./perfilusuario.page.scss'],
})
export class PerfilusuarioPage implements OnInit {

  // variable para el usuario que se envia mediante el servicio
  nombreusuario: string;

  // Datos del usuario
  nombre: string ;
  apellido: string;
  departamento: string;
  correoelectronico: string;
  fechanacimiento: string;
  password: string;
  localidad: string;
  actividadeconomica: string;

  // Arreglo para datos
  datosusuario: any;

  constructor(public navCtrl: NavController,
              private postPvdr: PostProvider,
              public toastCtrl: ToastController,
              private storage: Storage) {
              this.obtenerDatos();
              }

  ngOnInit() {}

  cerrarSesion() {

    // Obtengo el valor de la sesion, el usuario
    this.storage.get('inicio_sesion').then((val) => {
      console.log('Valor del inicio de sesion', val);
      this.nombreusuario = val;
    }); 

    // Armo el cuerpo del body a leer por la bd
    const body = {
      usuario: this.nombreusuario,
      aksi: 'cerrarsesion'
    };

    // Se inicia el servicio
    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    // Se subscribe
    provider.subscribe(async data => {
      // Si data no es null
      console.log('Se suscribio');
      const json = JSON.parse(data);
      console.log(json.inicio);
      console.log(data);
      if (json.inicio === '1') {
        this.navCtrl.navigateRoot(['/inicio']);
        const toast = await this.toastCtrl.create({
        message: 'Se ha cerrado Sesión.',
        duration: 2000
        });
        toast.present();
      } else {
        const toast = await this.toastCtrl.create({
        message: 'No se pudo cerrar sesión, intentar de nuevo',
        duration: 2000 });
        toast.present();
      }
    });
  } // Fin de la funcion

  // Ver datos de perfil
  verDatosdeUsuario() {
    const body = {
      usuario: this.nombreusuario,
      aksi: 'obtenerDatosUsuario'
    };
    console.log(body);

    const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

    provider.subscribe(
      async data => {
        const json = JSON.parse(data);
        this.datosusuario = json.result;
        console.log(this.datosusuario);
        if ( json.lectura === '1') {
          const toast = await this.toastCtrl.create({
            message: 'Lectura de Datos exitosa',
            duration: 3000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: 'La lectura de datos del usuario falló',
            duration: 3000,
          });

          toast.present();
        }
        this.nombre = this.datosusuario[0].nombre;
        this.apellido = this.datosusuario[0].apellido;
        this.departamento = this.datosusuario[0].departamento;
        this.correoelectronico = this.datosusuario[0].correoelectronico;
        this.fechanacimiento = this.datosusuario[0].fecha_nacimiento;
        this.localidad = this.datosusuario[0].localidad;
        this.password = this.datosusuario[0].password;
        this.actividadeconomica = this.datosusuario[0].actividad_economica;
        console.log(this.nombre);
        });

     } // Fin de la funcion

     obtenerUsuario() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve (
            this.storage.get('inicio_sesion').then((val) => {
            this.nombreusuario = val; }) // Obtengo el valor de la sesion, el usuario
          );
        }, 200);
     });
    }

    async obtenerDatos() {
      const msg = await this.obtenerUsuario();
      this.verDatosdeUsuario();
    }

    // Modificar los datos personales
    modificarDatosUsuario() {

      // Cuerpo
      const body = {
        nombre: this.nombre,
        apellido: this.apellido,
        password: this.password,
        fecha_nacimiento: this.fechanacimiento,
        actividad_economica: this.actividadeconomica,
        localidad: this.localidad,
        departamento: this.departamento,
        correoelectronico: this.correoelectronico,
        usuario: this.nombreusuario,
        aksi: 'actualizarDatosUsuario'
      };

      // Mostrar el cuerpo
      console.log(body);
      // Inicializar el servicio
      const provider: Observable <any> = this.postPvdr.postData(body, '/index.php');

      provider.subscribe(
        async data => {
          const json = JSON.parse(data);
          this.datosusuario = json.result;
          console.log(this.datosusuario);
          if ( json.actualizacion === '1') {
            const toast = await this.toastCtrl.create({
              message: 'Actualización de Datos exitosa',
              duration: 3000
            });
            toast.present();
          } else {
            const toast = await this.toastCtrl.create({
              message: 'La actualización de datos del usuario falló',
              duration: 3000,
            });

            toast.present();
          }
        });

      this.verDatosdeUsuario();
    }

} // Fin de la clase
