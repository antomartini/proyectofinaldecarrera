<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers");
header("Content-Type: application/json; charset=utf-8");

include("conexion.php");

$postjson = json_decode(file_get_contents('php://input'), true);
$today    = date('Y-m-d');

// // //Actualizacion todos los días, tiempo de notificaciones
$sqlnotificaciones = "SELECT * FROM Notificacion WHERE estado = '1'";
$resultadonotificaciones = $conexion->query($sqlnotificaciones);

while ($data = mysqli_fetch_array($resultadonotificaciones)) {
	$fecha = date('Y-m-d', strtotime(str_replace('-', '/', $data['fecha_creacion'])));

	// Obtenemos la diferencia en milisegundos
	$diff = abs(strtotime($today) - strtotime($fecha));
	$years = floor($diff / (365*60*60*24));
	$months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24));
	$tiempovida = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
	
	// Es ESTADO
	 if($data['tipo_notificacion'] == 2) { 
	 	$notificacion = "SELECT * FROM Estado WHERE id_notificacion = '$data[id_notificacion]'";
	 	$sqlnotif = $conexion->query($notificacion);

		if ($tiempovida == 20) {
			$queryNotificacion = "UPDATE Notificacion SET estado='0'
			 				WHERE id_notificacion = '$data[id_notificacion]'";
			$resultadonotificacion = $conexion->query($queryNotificacion); 
			$queryNotificacion = "UPDATE Estado SET tiempo_vida='0'
			WHERE id_notificacion = '$data[id_notificacion]'";
			$resultadonotificacion = $conexion->query($queryNotificacion);
		} else {
			$tiempovida = 20 - $tiempovida;
			$queryNotificacion = "UPDATE Estado SET tiempo_vida='$tiempovida'
			WHERE id_notificacion = '$data[id_notificacion]'";
			$resultadonotificacion = $conexion->query($queryNotificacion); 
		}

	 } else {
	 // ES AFECTACION

	 if ($tiempovida == 30) {
		$queryNotificacion = "UPDATE Afectacion SET estado='0'
						 WHERE id_notificacion = '$data[id_notificacion]'";
		$resultadonotificacion = $conexion->query($queryNotificacion); 
		$queryNotificacion = "UPDATE Estado SET tiempo_vida='0'
		WHERE id_notificacion = '$data[id_notificacion]'";
		$resultadonotificacion = $conexion->query($queryNotificacion);
	} else {
		$tiempovida = 30 - $tiempovida;
		$queryNotificacion = "UPDATE Afectacion SET tiempo_vida='$tiempovida'
		WHERE id_notificacion = '$data[id_notificacion]'";
		$resultadonotificacion = $conexion->query($queryNotificacion); 
	}

	}

} // FIN CICLO DE ACTUALIZACION


// Para registrar el usuario en la base de datos
if($postjson['aksi']=='register'){

	$sqluser = "SELECT id_user FROM Login WHERE usuario = '$postjson[usuario]'";
	$resultadouser = $conexion->query($sqluser);
	$filas = $resultadouser->num_rows;

	if($filas > 0){
		echo "alert('El usuario ya existe', $filas)";
	} else {
		// <!-- insertar informacion del usuario -->
		$nombre = mysqli_real_escape_string($conexion,$postjson['nombre']);
		$apellido = mysqli_real_escape_string($conexion,$postjson['apellido']);
		$fecha_nacimiento = date('Y/m/d',strtotime($postjson['fecha_nacimiento']));
		$correoelectronico = mysqli_real_escape_string($conexion,$postjson['correoelectronico']);
		$actividad_economica = mysqli_real_escape_string($conexion,$postjson['actividad_economica']);
		$localidad= mysqli_real_escape_string($conexion,$postjson['localidad']);
		$departamento = mysqli_real_escape_string($conexion,$postjson['departamento']);
		$usuario = mysqli_real_escape_string($conexion,$postjson['usuario']);
		$password = mysqli_real_escape_string($conexion,$postjson['password']);
	
		//Registro de Usuario
		$sqlusuario = "INSERT INTO UsuarioRegistrado (nombre,apellido,fecha_nacimiento,correoelectronico,actividad_economica,fecha_registro,fecha_actualizacion, localidad, departamento) 
		VALUES ('$nombre','$apellido','$fecha_nacimiento','$correoelectronico', '$actividad_economica','$today', '$today','$departamento','$departamento') ";
		//Se ejecuta el INSERT en la BD
		$resultadousuario = $conexion->query($sqlusuario);
		
		// Se crea el registro en la tabla de LOGIN
		$consultaid = "SELECT id_usuario_reg FROM UsuarioRegistrado ORDER by id_usuario_reg DESC LIMIT 1";
		$resultadoid = $conexion->query($consultaid);	
		$extraido= mysqli_fetch_array($resultadoid);

		// Se inserta en la Tabla Login de Usuario 
		$sqllogin = "INSERT INTO Login (usuario, password, id_usuario_reg) VALUES ('$usuario','$password','$extraido[id_usuario_reg]')";
		//Se ejecuta el INSERT en la BD
		$resultadologin = $conexion->query($sqllogin);	

		// Se inserta en la tabla de Inicion de Sesion
		$sqlinicio = "INSERT INTO IniciodeSesion (id_usuario_reg, nombre_usuario, fecha_inicio, estado_usuario, id_sistema) VALUES ('$extraido[id_usuario_reg]','$usuario','$today',1,1)";
		//Se ejecuta el INSERT en la BD
		$resultadoinicio = $conexion->query($sqlinicio);
			
		// Se crea el Historial de Notificaciones para el usuario
		$sqlHistorial = "INSERT INTO HistorialdeNotificaciones (fecha_actualizacion, cant_notificaciones, id_usuario_reg, usuario) VALUES ('$today','0','$extraido[id_usuario_reg]', '$usuario')";
		// Se ejecuta el INSERT en la BD
		$resultadoHistorial = $conexion->query($sqlHistorial);	


		if($resultadousuario) {
			
			$result = json_encode(array('success'=>false, 'msg' => 'Exito', 'registro' => '1'));
			
		} else { 		
			$result = json_encode(array('success'=>false, 'msg' => 'Error, intentar de nuevo', 'registro' => '0'));
			
		}

		echo $result;
	}

	//Registro de Usuario
	$sqlusuario = "INSERT INTO Usuario (usuario_reg,id_sistema) VALUES (1,1) ";
	//Se ejecuta el INSERT en la BD
	$resultadousuario = $conexion->query($sqlusuario);

}

// Cuando el usuario consulta sus datos
elseif($postjson['aksi']=='obtenerDatosUsuario'){
	
	// Obtener id del usuario registrado 
	$consultaidusuario = "SELECT * FROM Login WHERE usuario='$postjson[usuario]'"; 
	$ejecucionidusuario = $conexion->query($consultaidusuario);
	$extraido = mysqli_fetch_array($ejecucionidusuario);

	// Obtener dato del usuario
	$queryConsulta = "SELECT * FROM UsuarioRegistrado WHERE id_usuario_reg='$extraido[id_usuario_reg]'"; 
	$ejecucionconsulta = $conexion->query($queryConsulta);
	$usuario= mysqli_fetch_array($ejecucionconsulta);

		$data[] = array(
			'nombre' => $usuario['nombre'],
			'apellido' => $usuario['apellido'],
			'departamento' => $usuario['departamento'],
			'fecha_nacimiento' => $usuario['fecha_nacimiento'],
			'correoelectronico' => $usuario['correoelectronico'],
			'localidad' => $usuario['localidad'],
			'actividad_economica' => $usuario['actividad_economica'],
			'password' => $extraido['password']
		);

	if($usuario) 
		$result = json_encode(array('success'=>true, 'result'=>$data, 'lectura'=>'1'));
	else 
		$result = json_encode(array('success'=>false));

	echo $result;
}

 // Actualizacion de los datos del usuario
elseif($postjson['aksi']=='actualizarDatosUsuario'){

	// <!-- insertar informacion del usuario -->
	$nombre = mysqli_real_escape_string($conexion,$postjson['nombre']);
	$apellido = mysqli_real_escape_string($conexion,$postjson['apellido']);
	$fecha_nacimiento = mysqli_real_escape_string($conexion,$postjson['fecha_nacimiento']);
	$fecha_nacimiento = date('Y-m-d', strtotime(str_replace('-', '/', $fecha_nacimiento)));
	$correoelectronico = mysqli_real_escape_string($conexion,$postjson['correoelectronico']);
	$actividad_economica = mysqli_real_escape_string($conexion,$postjson['actividad_economica']);
	$localidad= mysqli_real_escape_string($conexion,$postjson['localidad']);
	$departamento = mysqli_real_escape_string($conexion,$postjson['departamento']);
	$usuario = mysqli_real_escape_string($conexion,$postjson['usuario']);
	$password = mysqli_real_escape_string($conexion,$postjson['password']);

	// Obtener el id del usuario
	$consultaid = "SELECT * FROM Login WHERE usuario = '$postjson[usuario]'";
	$ejecutarconsulta = $conexion->query($consultaid);
	$usuario = mysqli_fetch_array($ejecutarconsulta);

	// Actualizar datos del usuario
	$queryPerfildeDatos = "UPDATE UsuarioRegistrado SET
							nombre='$nombre', apellido='$apellido', fecha_nacimiento='$fecha_nacimiento',
							correoelectronico='$correoelectronico', actividad_economica='$actividad_economica',
							localidad='$localidad', departamento='$departamento'
							WHERE id_usuario_reg = '$usuario[id_usuario_reg]'"; 
	$ejecucionActualizacion = $conexion->query($queryPerfildeDatos);

	// Actualizar contraseña del usuario
	$queryPassword = "UPDATE Login SET
							password='$password'
							WHERE id_usuario_reg = '$usuario[id_usuario_reg]'";
	$ejecucionPassword = $conexion->query($queryPassword);
	
	if($ejecucionActualizacion && $queryPassword) $result = json_encode(array('success'=>true, 'result'=>'success', 'msg' => 'Actualizacion de datos', 'actualizacion' =>'1'));
	else $result = json_encode(array('success'=>false, 'result'=>'error', 'msg' => 'Error al actualizar los datos'));

	echo $result;

}

 // Proceso de eliminar una notificacion
elseif($postjson['aksi']=='eliminarnotificacion'){
	// Actualizar estado de la notificacion a eliminado
	$querynotificacion = "UPDATE Notificacion SET estado = '0'
						WHERE id_notificacion = '$postjson[id_notificacion]'"; 
	$ejecucionActualizacion = $conexion->query($querynotificacion);
}

// Proceso de Inicio de Sesión
elseif($postjson['aksi']=="login"){

  $consulta = "SELECT * FROM Login WHERE usuario='$postjson[usuario]' AND password='$postjson[password]'";
  $resultado = $conexion->query($consulta);
  $filas = $resultado->num_rows;
  $us = mysqli_fetch_array($resultado);

  if($filas>0){
	$data = mysqli_fetch_array($resultado);
	$datauser = array(
	  'id_user' => $data['id_user'],
	  'usuario' => $data['usuario'],
	  'password' => $data['password']
	);
	$result = json_encode(array('success'=>true, 'result'=>$datauser, 'msg'=>'INICIO DE SESION', 'inicio'=>'1'));

	
	// Cambiar el estado del usuario: en sesion = 1, inactivo = 0
	$cambiar_estado = "UPDATE Login SET estado_activo = 1 WHERE usuario='$postjson[usuario]'";
	$estado_cambiado = $conexion->query($cambiar_estado);

  }else{
	$result = json_encode(array('success'=>false, 'msg'=>'Cuenta no registrada'));
  }
  	//Registro de Usuario
	$sqlusuario = "INSERT INTO Usuario (usuario_reg,id_sistema) VALUES (1,1) ";
	//Se ejecuta el INSERT en la BD
	$resultadousuario = $conexion->query($sqlusuario);
	

	// Cambiar el estado del usuario: en sesion = 1, inactivo = 0
	$cambiar_estado = "UPDATE IniciodeSesion SET estado_usuario = 1 WHERE nombre_usuario='$postjson[usuario]'";
	$estadocambiado = $conexion->query($cambiar_estado);
	
	$cambiar_estado = "UPDATE IniciodeSesion SET fecha_inicio = '$today' WHERE nombre_usuario='$postjson[usuario]'";
	$estadocambiado = $conexion->query($cambiar_estado);
	

  echo $result;
 } 
 
 // Proceso de Cerrar Sesión
 elseif($postjson['aksi']=="cerrarsesion"){

   // Cambiar el estado del usuario: en sesion = 1, inactivo = 0
	$cambiar_estado = "UPDATE IniciodeSesion SET estado_usuario = 0 WHERE nombre_usuario='$postjson[usuario]'";
	$estadocambiado = $conexion->query($cambiar_estado);
	
	$cambiar_estado = "UPDATE IniciodeSesion SET fecha_cierre = '$today' WHERE nombre_usuario='$postjson[usuario]'";
	$estadocambiado = $conexion->query($cambiar_estado);

   if(!empty($estadocambiado)){
	$result = json_encode(array('success'=>true, 'msg'=>'INICIO DE SESION', 'inicio'=>'1'));
    } else {
	 $result = json_encode(array('success'=>false, 'msg'=>'No se pudo cerrar sesion'));
   }
 
   echo $result;
 }

 // Creacion de nueva notificacion
elseif ($postjson['aksi']=='notificacionnueva') {  
	// Variables para la creacion de una notificacion
	$fecha_creacion = date('Y/m/d',strtotime($postjson['fecha_creacion']));
	$lon = mysqli_real_escape_string($conexion,$postjson['lon']);
	$lat = mysqli_real_escape_string($conexion,$postjson['lat']);
	$imagen = mysqli_real_escape_string($conexion,$postjson['imagen']);
	$descripcion = mysqli_real_escape_string($conexion,$postjson['descripcion']);
	$tipo_notificacion = mysqli_real_escape_string($conexion,$postjson['tipo_notificacion']);
	$estado = mysqli_real_escape_string($conexion,$postjson['estado']);
	$afectacion = mysqli_real_escape_string($conexion,$postjson['afectacion']);
	$lat_desembocadura = mysqli_real_escape_string($conexion,$postjson['lat_desembocadura']);
	$lon_desembocadura = mysqli_real_escape_string($conexion,$postjson['lon_desembocadura']);

	# Extraigo el id del usuario que creo la notificación
	$consultaidusuario = "SELECT id_usuario_reg FROM Login WHERE usuario='$postjson[usuario]'";
	$ejecucionconsulta = $conexion->query($consultaidusuario);
	$extraido= mysqli_fetch_array($ejecucionconsulta);
	
	// Insertar notificacion nueva
	$sqlnotificacionnueva = "INSERT INTO Notificacion (fecha_creacion,fecha_actualizacion,lon,lat,descripcion,tipo_notificacion,id_usuario_reg,imagen) 
	VALUES ('$fecha_creacion','$today','$lon','$lat','$descripcion','$tipo_notificacion','$extraido[id_usuario_reg]','$imagen') ";
	//Se ejecuta el INSERT en la BD
	$resultadonotificacionnueva= $conexion->query($sqlnotificacionnueva);

	// Se busca el id de la notificacion creada
	$consultaid = "SELECT * FROM Notificacion ORDER by id_notificacion DESC LIMIT 1";
	$resultadoid = $conexion->query($consultaid);	
	$extraido= mysqli_fetch_array($resultadoid);

	// Insertar en la tabla del tipo de notificacion correspondiente
	if ($tipo_notificacion == '1') { 
		// Camino Nuevo
		$sqlestado = "INSERT INTO CaminoNuevo (id_notificacion,lat_desembocadura,lon_desembocadura) 
						VALUES ('$extraido[id_notificacion]','$lat_desembocadura','$lon_desembocadura')";
		//Se ejecuta el INSERT en la BD
		$resultadoestado = $conexion->query($sqlestado);
	} elseif ($tipo_notificacion == '2') {
		// Estado
		$sqlestado = "INSERT INTO Estado (id_notificacion,tipo_notificacion,tiempo_vida) 
						VALUES ('$extraido[id_notificacion]','$estado','30')";
		//Se ejecuta el INSERT en la BD
		$resultadoestado = $conexion->query($sqlestado);	

	} else {
		//Afectacion
		$sqlestado = "INSERT INTO Afectacion (id_notificacion,tipo_afectacion,tiempo_vida) 
						VALUES ('$extraido[id_notificacion]','$afectacion','30')";
		//Se ejecuta el INSERT en la BD
		$resultadoestado = $conexion->query($sqlestado);
	}

	// Valoración de la notificacion
	$sqlvalor = "INSERT INTO Valoracion (id_notificacion,valor_notificacion,cantidad) 
	VALUES ('$extraido[id_notificacion]','0','1')";
	$resultadovalor = $conexion->query($sqlvalor);

	//Si el registro fue exitoso	
	if($resultadonotificacionnueva > 0) {
		echo " alert('Creacion de Notificacion Nueva Exitosa');"; 

	} else {
	echo "alert('ERROR al crear la notificacion');";

	}


	if($resultadonotificacionnueva > 0) $result = json_encode(array('success'=>true));
	else $result = json_encode(array('success'=>false, 'msg' => 'Error de creacion, intentar de nuevo'));
	echo $result;

	// Actualizar el Historial de Notificaciones
	$queryConsulta = "SELECT cant_notificaciones FROM HistorialdeNotificaciones WHERE id_usuario_reg='$extraido[id_usuario_reg]'"; 
	$ejecucionconsulta = $conexion->query($queryConsulta);
	$fila= mysqli_fetch_array($ejecucionconsulta);
	$cantidad = $fila['cant_notificaciones']+1;

	$queryHistorial = "UPDATE HistorialdeNotificaciones SET fecha_actualizacion='$today', cant_notificaciones='$cantidad'
						WHERE id_usuario_reg = '$extraido[id_usuario_reg]'"; 
							
	$ejecucionHistorial= $conexion->query($queryHistorial);

}
// Proceso de Visualizacion de Notificaciones
elseif($postjson['aksi']=="visualizarnotificacion"){

	$consulta = "SELECT * FROM Notificacion";
	$resultado = $conexion->query($consulta);
	$filas = $resultado->num_rows;
  
	if($filas>0){

	//Crear un arreglo en blanco
	$notificaciones = array();

	while ($data = mysqli_fetch_array($resultado)) {
	$notificaciones[] = array(
	 		'lon' => $data['lon'],
	 		'lat' => $data['lat'],
			 'tipo_notificacion' => $data['tipo_notificacion'],
			 'id_notificacion' => $data['id_notificacion']
		  );
	 }
		
	  $result = json_encode(array('success'=>true, 'result'=>$notificaciones , 'msg'=>'Extraidos'));
  
	}else{
	  $result = array('success'=>false, 'msg'=>'Error al cargas las notificaciones');
	}
  
	echo $result; }

	// Proceso de Visualizacion de HistorialDeNotificaciones
elseif($postjson['aksi']=="historialdenotificaciones"){

	$consultausuario = "SELECT * FROM Login WHERE usuario='$postjson[usuario]'";
	$resultadousuario = $conexion->query($consultausuario);
	$usuario = mysqli_fetch_array($resultadousuario);


	$consultahistorial = "SELECT * FROM Notificacion WHERE id_usuario_reg='$usuario[id_usuario_reg]'
							AND estado = '1'";
	$resultadoHistorial = $conexion->query($consultahistorial);
	$filas = $resultadoHistorial->num_rows;
  
	if($filas>0){

	//Crear un arreglo en blanco
	$notificaciones = array();

	while ($data = mysqli_fetch_array($resultadoHistorial)) {
	$notificaciones[] = array(
			'fecha_creacion' => $data['fecha_creacion'],
	 		'lon' => $data['lon'],
			'lat' => $data['lat'],
			'id_notificacion' => $data['id_notificacion'],
	 		'tipo_notificacion' => $data['tipo_notificacion']
		  );
	 }
		
	  $result = json_encode(array('success'=>true, 'result'=>$notificaciones , 'msg'=>'Extraidos'));
  
	}else{
	  $result = json_encode(array('success'=>false, 'msg'=>'No se pudo'));
	}
  
	echo $result; 

} 	// Proceso de Visualizacion una notificacion
elseif($postjson['aksi']=="leernotificacion"){

	$consultaid = "SELECT * FROM Notificacion WHERE id_notificacion='$postjson[id]'";
	$resultadoid = $conexion->query($consultaid);
	$filas = $resultadoid->num_rows;

	if($filas>0){
	//Crear un arreglo en blanco
	$notificaciones = array();

	while ($data = mysqli_fetch_array($resultadoid)) {
	$notificaciones[] = array(
			'fecha_creacion' => $data['fecha_creacion'],
	 		'lon' => $data['lon'],
	 		'lat' => $data['lat'],
			'tipo_notificacion' => $data['tipo_notificacion'],
			'imagen' => $data['imagen'],
			'descripcion' => $data['descripcion'],
		  );
		  
		  // usuario
		  $consultaUsuario = "SELECT * FROM Login WHERE id_usuario_reg ='$data[id_usuario_reg]'";
		  $resultadoUsuario = $conexion->query($consultaUsuario);
		  $usuario = mysqli_fetch_array($resultadoUsuario);

		  if ($data['tipo_notificacion']== '2') {
			$consultanotif = "SELECT * FROM Estado WHERE id_notificacion ='$data[id_notificacion]'";
			$resultadonotif = $conexion->query($consultanotif);
			$notif = mysqli_fetch_array($resultadonotif);
			$notiftipo = $notif ['tipo_notificacion'];
		  } elseif ($data['tipo_notificacion']== '3') {
			$consultanotif = "SELECT * FROM Afectacion WHERE id_notificacion ='$data[id_notificacion]'";
			$resultadonotif = $conexion->query($consultanotif);
			$notif = mysqli_fetch_array($resultadonotif);
			$notiftipo = $notif ['tipo_afectacion'];
		  } else {
			$consultanotif = "SELECT * FROM CaminoNuevo WHERE id_notificacion ='$data[id_notificacion]'";
			$resultadonotif = $conexion->query($consultanotif);
			$notif = mysqli_fetch_array($resultadonotif);
			$notiftipo = $notif ['id_notificacion'];
		  }
		}

	
	$consultaValor = "SELECT valor_notificacion FROM Valoracion WHERE id_notificacion='$postjson[id]'";
	$resultadovalor = $conexion->query($consultaValor);
	$valoracion = mysqli_fetch_array($resultadovalor);
		
	  $result = json_encode(array('success'=>true, 
	  			'usuario'=>$usuario['usuario'],   
				'result'=>$notificaciones , 
				'valor'=>$valoracion,
				'notificacion'=>$notiftipo ,
				'msg'=>'Extraidos'));
  
	}else{
	  $result = json_encode(array('success'=>false, 'msg'=>'No se pudo cerrar sesion'));
	}
  
	echo $result; 

} // Comentar la notificacion
elseif($postjson['aksi']=="comentarnotificacion"){
	$id_notificacion = mysqli_real_escape_string($conexion,$postjson['id']);
	$comentario = mysqli_real_escape_string($conexion,$postjson['comentario']);

	//INSERTAR COMENTARIO
	$sqlcomentario = "INSERT INTO Comentarios (id_notificacion,comentario) 
						VALUES ('$id_notificacion','$comentario')";
	//Se ejecuta el INSERT en la BD
	$resultadocomentario = $conexion->query($sqlcomentario);

	if($resultadocomentario) echo " alert('Creacion de Notificacion Nueva Exitosa');";
	else echo "alert('ERROR al crear la notificacion');";
	 

} elseif($postjson['aksi']=="leercomentarios"){
	$id_notificacion = mysqli_real_escape_string($conexion,$postjson['id']);
	$consulta = "SELECT * FROM Comentarios WHERE id_notificacion = '$postjson[id]'";
	$resultado = $conexion->query($consulta);
	$filas = $resultado->num_rows;
  
	if($filas>0){

		//Crear un arreglo en blanco
		$comentarios = array();

		while ($data = mysqli_fetch_array($resultado)) {
		$comentarios[] = array(
				'comentarios' => $data['comentario']);
		}
			
		$result = json_encode(array('success'=>true, 'result'=>$comentarios, 'lectura'=>'1'));
		echo $result;
	}else{
		  $result = json_encode(array('result'=>$comentarios));
		echo $result;
	}
} elseif($postjson['aksi']=="valorar"){

	$id_notificacion = mysqli_real_escape_string($conexion,$postjson['id']);
	$valor = mysqli_real_escape_string($conexion,$postjson['valor']);

	$consulta = "SELECT * FROM Valoracion WHERE id_notificacion = '$postjson[id]'";
	$resultado = $conexion->query($consulta);
	$extraido = mysqli_fetch_array($resultado);

	$cantidad = $extraido['cantidad'] + 1;
	echo $cantidad;
	$valornuevo = ($valor + $extraido['valor_notificacion']) / 2;
	echo $valornuevo;

	$queryvaloracion = "UPDATE Valoracion SET valor_notificacion='$valornuevo', cantidad='$cantidad'
						 WHERE id_notificacion = '$id_notificacion' "; 
	$resultadovalor = $conexion->query($queryvaloracion);
	
}  elseif($postjson['aksi']=="cargardatosnotificacion"){

	$consultaid = "SELECT * FROM Notificacion WHERE id_notificacion='$postjson[id]'";
	$resultadoid = $conexion->query($consultaid);
	$filas = $resultadoid->num_rows;

	if($filas>0){
	//Crear un arreglo en blanco
	$notificaciones = array();

	while ($data = mysqli_fetch_array($resultadoid)) {
	$notificaciones[] = array(
			'fecha_creacion' => $data['fecha_creacion'],
	 		'lon' => $data['lon'],
	 		'lat' => $data['lat'],
			'imagen' => $data['imagen'],
			'descripcion' => $data['descripcion'],
		  );

	}
		
	  $result = json_encode(array('success'=>true,  
				'result'=>$notificaciones , 
				'msg'=>'Extraidos'));
  
	}else{
	  $result = json_encode(array('success'=>false, 'msg'=>'No se pudo cerrar sesion'));
	}
  
	echo $result; 
	
} elseif($postjson['aksi']=="actualizarnotificacion"){

	// Variables para la creacion de una notificacion
	$fecha_creacion = date('Y/m/d',strtotime($postjson['fecha_creacion']));
	$lon = mysqli_real_escape_string($conexion,$postjson['lon']);
	$lat = mysqli_real_escape_string($conexion,$postjson['lat']);
	$descripcion = mysqli_real_escape_string($conexion,$postjson['descripcion']);
	$id_notificacion = mysqli_real_escape_string($conexion,$postjson['id_notificacion']);

	$queryvaloracion = "UPDATE Notificacion SET 
							lon='$lon', 
							lat='$lat',
							descripcion='$descripcion',
							fecha_creacion='$fecha_creacion',
							fecha_actualizacion='$today'
						 WHERE id_notificacion = '$id_notificacion' "; 
	$resultadovalor = $conexion->query($queryvaloracion);

	
}
elseif($postjson['aksi']=="conexion"){

	//Registro de Usuario
	$sqlusuario = "INSERT INTO Usuario (usuario_reg,id_sistema) VALUES (0,1) ";
	//Se ejecuta el INSERT en la BD
	$resultadousuario = $conexion->query($sqlusuario);
	
}

?>

