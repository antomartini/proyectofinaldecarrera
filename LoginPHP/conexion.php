<?php
// incluir el archivo de configuracion
include ("configuracion.php");

// instanciar una variable conexion
$conexion = new mysqli($server,$user,$password,$bd);

// verificamos la conexion a la base de datos
if(mysqli_connect_errno()) {
    // imprimir en pantalla
    //echo "No conectado a la Base de Datos", mysqli_connect_error();
    exit(); 
} else {
    //echo "Conectado";
}


?>