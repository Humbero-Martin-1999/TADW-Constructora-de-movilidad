# API Constructora de Movilidad (Proyecto)

API RESTful para la gestión de proyectos, vehículos y reportes de acceso, implementada con Node.js, Express y MongoDB Atlas, con autenticación JWT y roles.

## Requisitos
- Node.js (v16+)
- npm
- Cuenta de MongoDB Atlas

## 1. Instalación

1.  Clona el repositorio:
    ```bash
    git clone <tu-repositorio>
    cd <tu-proyecto>
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

## 2. Configuración de Variables de Entorno

1.  Crea un archivo `.env` en la raíz del proyecto.
2.  Copia el contenido de `.env.example` (si lo tienes) o usa la siguiente plantilla:

    ```ini
    PORT=5000
    MONGO_URI=<Tu_String_de_Conexión_a_MongoDB_Atlas>
    JWT_SECRET=<Tu_Secreto_JWT_Super_Secreto>
    ```
    Reemplaza los valores con tu configuración.

## 3. Ejecutar la Aplicación

Para modo desarrollo (con recarga automática usando `nodemon`):
```bash
npm run dev
```

Para producción:
```bash
npm start
```
La API estará disponible en `http://localhost:5000`.

## 4. Cargar Datos de Prueba (Seeder)

Para cargar los usuarios de ejemplo (admin, analista, visitante) en la base de datos:

```bash
npm run import:users
```

**Credenciales de ejemplo:**
- **Admin:** `admin@ejemplo.com` / `password123`
- **Analista:** `analista@ejemplo.com` / `password123`

## 5. Flujo de Prueba (Reportes)

1.  **Registra un usuario** (o usa los de prueba).
2.  **Login (POST /api/auth/login)**:
    Usa las credenciales de `admin` o `analista` para obtener un token JWT.
3.  **Obtener Reporte (GET /api/reportes/accesos)**:
    -   Realiza una petición GET a `http://localhost:5000/api/reportes/accesos`.
    -   Asegúrate de incluir el token en la cabecera:
        `Authorization: Bearer <tu-token-jwt>`
    -   Prueba los filtros (query params):
        `?desde=2025-11-01&hasta=2025-11-18&recurso=proyecto&page=1&limit=5`