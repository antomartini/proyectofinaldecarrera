# Proyecto Final de Carrera de Ingenierìa en Informática de FICH-UNL. 2020-2021.
DESARROLLO DE UNA APLICACIÓN MÓVIL DE PARTICIPACIÓN CIUDADANA PARA EL MONITOREO DE CAMINOS RURALES EN LA REGIÓN CENTRO DE LA PROVINCIA DE SANTA FE

Alumna: Martini, María Antonella

Director: Prodolliet, Jorge

Co-Directora: Grand, Lucila


• Necesidad Identificada:

Las precipitaciones que ocurren anualmente dejan en evidencia las consecuencias sociales y productivas debido a las condiciones desfavorables de transitabilidad de los caminos rurales de la región centro de la provincia de Santa Fe. Los caminos en mal estado se consideran uno de los principales factores limitantes de la producción agropecuaria, especialmente la lechera, motor de los pueblos y ciudades del interior de los departamentos Las Colonias y Castellanos.

La participación ciudadana permite considerar perspectivas diferentes al definir un problema y generar de manera colectiva, posibles soluciones que integren aspectos sociales, económicos y ambientales. La oportunidad se presenta en la generación de aplicaciones móviles que a partir de la colaboración de los ciudadanos, permitan recabar los datos generados en esos entornos y analizarlos de manera que los resultados puedan ofrecer nuevas soluciones para optimizar los recursos y convertirse en una herramienta más para la toma de decisiones.

Objetivos:
Diseñar y desarrollar una aplicación móvil de participación ciudadana para el monitoreo de caminos rurales en la región centro de la provincia de Santa Fe. 
Objetivos Específicos
  1. Seleccionar las tecnologías que más se adecuen al presente trabajo para el desarrollo de aplicaciones móviles considerando las más difundidas en el mercado.
  2. Diseñar y desarrollar una aplicación móvil que permita generar un mapa de notificaciones en la zona centro de la provincia de Santa Fe.
  3. Seleccionar una herramienta óptima y desarrollar los algoritmos necesarios que permitan visualizar la localización del usuario, mediante la geolocalización del dispositivo móvil.
  4. Implementar el sistema en un servidor local para realizar pruebas con el prototipo de aplicación.


• Desarrollo:
Enmarcado en el concepto de Inteligencia Colectiva, en el presente proyecto, se desarrolló una aplicación móvil de participación ciudadana para el monitoreo de caminos rurales en la zona centro de Santa Fe. Este sistema funciona como una herramienta colaborativa que permite a los usuarios generar reportes sobre el estado de los caminos rurales utilizando tecnologías móviles. 

Se seleccionó como framework de desarrollo, Ionic junto a tecnologías web como HMTL, CSS y Javascript. Esto se debió, entre otros beneficios, a la facilidad de uso y su curva de aprendizaje pronunciada. Se adoptó la arquitectura MVC permitiendo que el desarrollo sea una tarea más sencilla al momento de debuggear,  detectar errores y aplicar soluciones a los problemas presentados por los diferentes módulos del sistema. Mediante el uso de la librería Leaflet y OpenStreetMap se logró implementar  el mapa de la Provincia, integrándolo con el desarrollo de la funcionalidad para crear, visualizar y modificar notificaciones de caminos rurales. Se utilizaron plugins brindados por el framework de Ionic para gestionar la ubicación del usuario. 

Se eligió Firebase Storage para el almacenamiento de las imágenes asociadas a la creación de notificaciones de estados de caminos rurales o afectaciones de la zona. 

La información generada por la aplicación se almacena en un sistema de base de datos basado en MySQL y se integra con un backend desarrollado en PHP.

• Resultado y Conclusiones:

Respecto a los  objetivos definidos para este proyecto, se cumplieron las expectativas y metas planteadas. Se desarrolló una aplicación móvil para Android que sirve como herramienta colaborativa y fuente de información para la ciudadanía de los departamentos de Castellanos y Las Colonias, y también como herramienta para el Ministerio de la Producción de Santa Fe. Para ello se utilizaron las metodologías, herramientas y tecnologías móviles seleccionadas con previo estudio y análisis de opciones.

Con el desarrollo de esta plataforma se logró obtener un nuevo posible canal de comunicación entre municipios, comunas y usuarios brindando la posibilidad de buscar otras vías en buen estado para transitar, advertir los problemas que pudieran existir y consultar información en forma gráfica mediante georreferenciación en un mapa de la Provincia.

Además, permite fomentar la inclusión y participación ciudadana; a la vez que se dotaría al Ministerio de la Producción con una nueva herramienta para generar estadísticas, información para la toma de decisiones, gestión de políticas públicas y contribuir a la visibilización de problemas en las zonas rurales de la Provincia. Por otro lado, cabe destacar la mirada social que se le puede otorgar a las tecnologías móviles. 

Es importante fomentar el uso de las TIC para involucrar a la ciudadanía en todo el ciclo de elaboración de políticas públicas. Con el presente proyecto, se fomentan valores como democracia, participación, ejercicio ciudadano, acceso a la información, prácticas de e-gobierno, entre los principales. 

