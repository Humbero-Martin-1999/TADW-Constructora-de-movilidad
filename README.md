# API Constructora de Movilidad (Proyecto de Taller)

API RESTful que implementa un sistema de autenticación (JWT) y autorización (roles) para una constructora. Permite gestionar el acceso a recursos y generar reportes de auditoría de acceso, utilizando Node.js, Express y MongoDB Atlas.

Este proyecto cumple con los siguientes objetivos:
* Conexión a MongoDB Atlas.
* Modelos Mongoose para los recursos de la empresa.
* Sistema de registro y login con contraseñas *hasheadas* (bcryptjs).
* Generación de tokens (JWT) para autenticación.
* Protección de rutas con middleware (autenticación y roles).
* Endpoint de reportes con filtros, paginación y agregaciones de MongoDB.
* Scripts (seeders) para poblar la base de datos con datos de prueba.

---

## 🚀 Configuración Inicial

Sigue estos pasos para poner en marcha el proyecto.

### 1. Requisitos Previos
* Node.js (v16+) instalado.
* npm (generalmente instalado con Node.js).
* Una cuenta de **MongoDB Atlas** y un cluster gratuito creado.

### 2. Clonar el Repositorio
```bash
git clone [https://github.com/Humbero-Martin-1999/TADW-Constructora-de-movilidad.git](https://github.com/Humbero-Martin-1999/TADW-Constructora-de-movilidad.git)
cd TADW-Constructora-de-movilidad
```

### 3. Instalar Dependencias
```bash
npm install
```

## 🔒 Configuración de Entorno (.env)

Este paso es **crítico**. Debes crear un archivo llamado `.env` en la raíz del proyecto para almacenar tus variables secretas.

1.  Crea el archivo `.env` en la raíz.
2.  Pega el siguiente contenido y reemplaza los valores:

    ```ini
    # Puerto para el servidor (5000 es una buena opción)
    PORT=5000

    # Pega tu string de conexión de MongoDB Atlas
    # Asegúrate de reemplazar <usuario>, <password> y <database-name>
    MONGO_URI=mongodb+srv://<usuario>:<password>@<tu-cluster-url>/<database-name>?retryWrites=true&w=majority

    # Secreto para firmar los tokens JWT (hazlo largo y aleatorio)
    JWT_SECRET=un_secreto_muy_largo_y_dificil_de_adivinar
    ```

> **Nota:** El archivo `.env` está correctamente listado en `.gitignore`, por lo que tus contraseñas y secretos **nunca** se subirán a GitHub.

## ⚡ Ejecutar el Proyecto

### 1. Iniciar el Servidor
Usa el script `dev` para correr el servidor con `nodemon`, que reiniciará automáticamente la API con cada cambio que guardes.

```bash
npm run dev
```
Si todo está bien, verás en la terminal:
```
Servidor corriendo en http://localhost:5000
MongoDB Conectado: <nombre-de-tu-cluster>.mongodb.net
```

### 2. Poblar la Base de Datos (Seeders)
Para que las pruebas de "Evidencias" funcionen, necesitas cargar datos de prueba. Hemos preparado dos scripts para esto.

**A. Cargar Usuarios (Admin, Analista, Visitante):**
```bash
npm run import:users
```
*(Verás: "Usuarios importados exitosamente!")*

**B. Cargar Datos de la Empresa (Proyectos, Vehículos y Accesos):**
```bash
npm run import:data
```
*(Verás: "¡Datos de ejemplo importados exitosamente!")*

---

## 🧪 Evidencias de Funcionamiento (Pruebas Clave)

Esta sección explica cómo probar que los objetivos del proyecto se cumplieron. Se recomienda usar una herramienta como **Postman** o la extensión "Rest Client" de VSCode.

### Credenciales de Prueba (de `import:users`)
* **Rol Admin:** `admin@ejemplo.com` / `password123`
* **Rol Analista:** `analista@ejemplo.com` / `password123`
* **Rol Visitante:** `visitante@ejemplo.com` / `password123`

---

### Evidencia 1: Autenticación (Login y Token JWT)

**Objetivo:** Demostrar que el login funciona y genera un token JWT.

1.  **Request (POST):** Envía una petición `POST` a `http://localhost:5000/api/auth/login`
2.  **Body (raw/json):**
    ```json
    {
        "email": "analista@ejemplo.com",
        "password": "password123"
    }
    ```
3.  **Response (Éxito 200):**
    Recibirás un JSON con los datos del usuario y el token.
    ```json
    {
        "_id": "674df834...",
        "nombre": "Analista User",
        "email": "analista@ejemplo.com",
        "rol": "analista",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
    ```
**Evidencia:** El `token` fue generado. **Copia este token.**

---

### Evidencia 2: Autorización (Rutas Protegidas y Roles)

**Objetivo:** Demostrar que el token JWT es necesario y que los roles (`admin`, `analista`) funcionan.

1.  **Prepara tu Token:** En Postman, ve a la pestaña `Authorization`, selecciona `Bearer Token` y pega el `token` que copiaste.
    

2.  **Prueba de Éxito (Rol Analista):**
    * **Request (GET):** `http://localhost:5000/api/reportes/accesos`
    * **Response (Éxito 200):** Recibirás la data del reporte.
    * **Evidencia:** El middleware `protect` (autenticación) y `authorize` (roles) permitieron el acceso al `analista`.

3.  **Prueba de Fallo (Rol Visitante):**
    * Haz login como `visitante@ejemplo.com` y obtén su token.
    * Usa ese nuevo token para hacer `GET` a `http://localhost:5000/api/reportes/accesos`.
    * **Response (Error 403 Forbidden):**
        ```json
        {
            "message": "Acceso denegado. Rol 'visitante' no tiene permiso para este recurso."
        }
        ```
    * **Evidencia:** El middleware de roles (`authorize`) bloqueó correctamente a un usuario no autorizado.

---

### Evidencia 3: Reporte con Agregación (Filtros y Paginación)

**Objetivo:** Demostrar que el endpoint de reportes utiliza el *Aggregation Pipeline* de MongoDB para filtrar, agrupar y paginar los datos de la colección `accesos`.

*(Recuerda usar el token de `admin` o `analista` para todas estas pruebas)*.

**A. Prueba de Paginación (`page` y `limit`)**
* **Request (GET):** `http://localhost:5000/api/reportes/accesos?page=1&limit=2`
* **Evidencia:** La respuesta `data` solo trae 2 resultados, y la metadata de paginación es correcta:
    ```json
    {
        "data": [ ... (2 elementos) ],
        "page": 1,
        "limit": 2,
        "totalPages": 3,
        "totalDocumentos": 5
    }
    ```

**B. Prueba de Filtro por Recurso (`recurso`)**
* **Request (GET):** `http://localhost:5000/api/reportes/accesos?recurso=proyecto`
* **Evidencia:** La respuesta `data` solo mostrará estadísticas de acceso al recurso "proyecto", agrupando los conteos.

**C. Prueba de Filtro por Fechas (`desde` / `hasta`)**
* **Request (GET):** `http://localhost:5000/api/reportes/accesos?desde=2025-11-10&hasta=2025-11-12`
* **Evidencia:** La respuesta `data` solo incluirá estadísticas de los accesos ocurridos entre esas dos fechas (inclusive), demostrando el filtro `$match` con `$gte` y `$lte`.
