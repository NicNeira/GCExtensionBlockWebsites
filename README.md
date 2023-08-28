## Cargar la Extensión

1. **Abrir Chrome:** Abre el navegador Google Chrome en tu computadora.
2. **Ir a Extensiones:** Ingresa `chrome://extensions/` en la barra de direcciones y presiona Enter.
3. **Habilitar Modo de Desarrollador:** Encuentra la esquina superior derecha de la página de Extensiones y activa la casilla "Modo de desarrollador".
4. **Cargar Extensión Desempaquetada:** Haz clic en el botón "Cargar desempaquetada" en la parte superior izquierda.
5. **Seleccionar la Carpeta:** Navega a la carpeta donde tienes el código de tu extensión y selecciona la carpeta que contiene el archivo `manifest.json`.
6. **Cargar la Extensión:** Haz clic en "Seleccionar" o "Abrir" (dependiendo de tu sistema operativo) para cargar la extensión.

## Probar la Extensión

1. **Acceder a las Opciones:** Haz clic derecho en el icono de tu extensión en la barra de herramientas de Chrome y selecciona "Opciones" para abrir la página de opciones de tu extensión.
2. **Configurar las Opciones:** Ingresa los sitios web que deseas bloquear y configura las horas de inicio y fin laboral según tus necesidades.
3. **Guardar Cambios:** Haz clic en el botón "Guardar" en la página de opciones para aplicar los cambios.
4. **Verificar el Bloqueo:** Navega a uno de los sitios web bloqueados durante las horas laborales configuradas y verifica que el sitio está bloqueado.
5. **Verificar Fuera de Horario Laboral:** Cambia la hora de tu computadora para que esté fuera del horario laboral configurado y verifica que los sitios bloqueados ahora son accesibles.

## Solucionar Problemas

Si encuentras algún problema:

- Revisa la consola de la página de Extensiones (haz clic en "detalles" en tu extensión y luego en "ver en consola de fondo") para buscar errores o mensajes de registro.
- Asegúrate de que tu extensión tiene los permisos correctos en `manifest.json`.
- Verifica que los archivos JavaScript y HTML estén correctamente vinculados y no contengan errores de sintaxis.

Recuerda que cualquier cambio en los archivos de la extensión requerirá que la recargues. Puedes hacer esto haciendo clic en el botón "Recargar" (ícono de flecha circular) en la página de Extensiones junto a tu extensión.

## Proximos Pasos

- [ ] Agregar un botón de "On/Off" para prender apagar el bloqueo de sitios web.
- [✅] Corregir error al momento de terminar el tiempo de bloqueo. Ya que no deja de bloquear los sitios web.
- [✅] En vez de una pagina de opciones, agregar un popup o modal como otras extensiones para configurar los sitios web y el tiempo de bloqueo.
- [ ] La funcion evaluateBlockingRules() en background.js se ejecuta 2 veces al momento de actualizar la extension, Corregir.