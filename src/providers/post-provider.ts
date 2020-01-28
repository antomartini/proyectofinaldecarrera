import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';


@Injectable({
 providedIn: 'root'
})

export class PostProvider {
	server: string = 'http://192.168.0.26/proyectofinal/LoginPHP'; // default
	// if you test in real device "http://localhost" change use the your IP	
    // server: string = "http://192.199.122.100/IONIC4_CRUD_LOGINREGIS_PHP_MYSQL/server_api/"; 

	constructor(
				public httpcliente: HttpClient ) {

	}

	postData(body, file){

return this.httpcliente.post(this.server + file, body, { responseType: 'text'} );
}

}