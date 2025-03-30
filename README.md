# Proyecto: Prueba Técnica Sinapsis

Este es un proyecto en Node.js con Express para manejar campañas.

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/EnzoMartinez01/PruebaTecnicaSinapsis.git
   ```
2. Entra en la carpeta del proyecto:
   ```sh
   cd prueba-tenica-sinapsis
   ```
3. Instala las dependencias:
   ```sh
   npm install
   ```
   EN CASO NO SE LOGRE INSTALAR SERVERLESS FRAMEWORK, HACER LO SIGUIENTE:
   ```sh
   npm install -g serverless
   ```

## Configuración

Antes de correr el proyecto, asegúrate de configurar tu base de datos en el archivo de configuración.

Crea un archivo `.env` y agrega los datos de tu base de datos:
   ```sh
   DB_HOST=localhost
   DB_USER=tuUsuario
   DB_PASSWORD=tuContraseña
   DB_NAME=nombreBD
   DB_PORT=3306
   SECRET_KEY=TuClaveSegura
   ```

## Uso

Para iniciar el servidor en desarrollo:
   ```sh
   npm run dev
   ```

Para correr en producción:
   ```sh
   npm start
   ```
o correr con serverless en modo offline:
```sh
   serverless offline
   ```

## Pruebas

Para ejecutar las pruebas con Jest:
   ```sh
   npm test
   ```

## Endpoints principales
- **POST /auth/login** → Autentica un usuario (LAS CREDENCIALES SON EL NOMBRE DEL CUSTOMER TANTO NAME Y PASSWORD).
- **PUT /campaigns/:campaignId/calculate-totals** → Calcula los totales de una campaña.
- **PUT /campaigns/:campaignId/update-status** → Actualiza el estado de una campaña.
- **GET /campaigns/sucessful-messages** → Obtiene mensajes exitosos.
- **GET /campaigns/participation/:customerId** → Obtiene la participación de un usuario.

## Ejemplo de uso
Para autenticar un usuario, debes enviar un POST con los datos de tu usuario:
   ```sh
   curl --location --request POST 'http://localhost:3000/auth/login' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "name": "customerName",
       "password": "customerPassword"
   }'
   ```

Respuesta:

    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
    ```

Una vez autenticado, puedes realizar llamadas a los endpoints:

   ```sh
   curl --location --request PUT 'http://localhost:3000/campaigns/1/calculate-totals' \
   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
   ```

Respuesta:

    ```json
    {
        "message": "Totales de la campaña actualizados",
        "totalRecords": 10,
        "totalSent": 5
    }
    ```