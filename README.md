# Reservi

Reservi es una aplicación para gestionar reservas y usuarios. Este README proporciona instrucciones para instalar el repositorio, usar los filtros, crear un usuario y crear una reserva.

## Instalación

Sigue estos pasos para instalar el repositorio en tu máquina local:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/cristianbravoq/reservi-test/
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd reservi
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Inicia la aplicación:
    ```bash
    npm start
    ```

## Uso de los Filtros

La aplicación permite filtrar usuarios por nombre, teléfono y correo electrónico. Sigue estos pasos para usar los filtros:

1. En la página principal, verás un conjunto de campos de entrada para filtrar usuarios.
2. Ingresa el valor que deseas filtrar en el campo correspondiente (nombre, teléfono o correo electrónico).
3. Haz clic en el botón de filtro (icono de `+`) para mantener el filtro.
4. Los usuarios que coincidan con los criterios de filtro se mostrarán en la lista.

## Crear un Usuario

Para crear un nuevo usuario, sigue estos pasos:

1. En el menu ubicado en la esquina superior derecha navega a la sección de usuarios.
2. Haz clic en el botón "Crear Usuario".
3. Completa el formulario con la información del usuario (nombre, dirección, teléfono y correo electrónico).
4. Haz clic en el botón "Guardar" para crear el usuario.

## Crear una Reserva

Para crear una nueva reserva, sigue estos pasos:

1. En el menu ubicado en la esquina superior derecha navega a la sección de reservas.
2. Haz clic en el botón "Crear Reserva".
3. Selecciona el usuario para el cual deseas crear la reserva buscando por el numero de telefono.
4. Selecciona la fecha y el intervalo de tiempo para la reserva.
5. Haz clic en el botón "Guardar" para crear la reserva.

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Sube tus cambios a tu fork (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request en el repositorio original.
