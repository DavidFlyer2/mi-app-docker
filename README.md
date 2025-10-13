# 🚀 Proyecto: Node.js + MongoDB + Docker

**Estudiante:** David Cuevas  
**Materia:** Bases de Datos No Relacionales  
**Tecnologías:** Node.js, Express, MongoDB, Docker, Yarn

---

## 📋 Descripción

Aplicación web que demuestra la integración de:
- **Backend:** Node.js con Express
- **Base de Datos:** MongoDB Atlas
- **Gestión de Paquetes:** Yarn
- **Contenedorización:** Docker
- **Despliegue:** Render (o cualquier plataforma compatible)

---

## 🛠️ Requisitos Previos

- Node.js 18+ 
- Docker Desktop instalado
- Cuenta en MongoDB Atlas
- Yarn (se instala automáticamente con corepack)

---

## 📦 Instalación Local

### 1️⃣ Clonar el repositorio
```bash
git clone <tu-repositorio>
cd mi-app-docker
```

### 2️⃣ Configurar variables de entorno
```bash
# Crea un archivo .env con tus credenciales
cp .env.example .env
# Edita .env y reemplaza con tu URI de MongoDB
```

### 3️⃣ Instalar dependencias
```bash
# Habilitar corepack (si no está habilitado)
corepack enable

# Instalar dependencias con Yarn
yarn install
```

### 4️⃣ Ejecutar localmente
```bash
yarn start
# Abre http://localhost:3000
```

---

## 🐳 Ejecución con Docker

### Construir la imagen
```bash
docker build -t mi-app-mongodb .
```

### Ejecutar el contenedor
```bash
docker run -p 3000:3000 \
  -e MONGODB_URI="tu_uri_completa_aqui" \
  -e PORT=3000 \
  -e NODE_ENV=production \
  mi-app-mongodb
```

### Verificar que funciona
```bash
# En otra terminal
curl http://localhost:3000/api/health
```

---

## 🌐 Rutas de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal con interfaz HTML |
| GET | `/api/health` | Estado del servidor y MongoDB |
| GET | `/api/test` | Prueba de inserción en MongoDB |
| GET | `/api/usuarios` | Obtener todos los usuarios |
| POST | `/api/usuarios` | Crear un nuevo usuario |
| DELETE | `/api/usuarios/limpiar` | Limpiar colección (solo desarrollo) |

---

## 📝 Ejemplo de Uso

### Crear un usuario (POST)
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "David Cuevas",
    "email": "david@ejemplo.com",
    "carrera": "Ingeniería en Sistemas"
  }'
```

### Obtener usuarios
```bash
curl http://localhost:3000/api/usuarios?limit=10
```

---

## 🔧 Configuración de MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura acceso de red (IP: 0.0.0.0/0 para permitir todas)
4. Crea un usuario de base de datos
5. Obtén tu connection string
6. Reemplaza `<password>` con tu contraseña real

**Formato de URI:**
```
mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🚢 Despliegue en Render

### Variables de Entorno en Render:
```
MONGODB_URI=tu_uri_completa_de_mongodb
PORT=3000
NODE_ENV=production
```

### Comando de Build:
```bash
yarn install
```

### Comando de Start:
```bash
yarn start
```

---

## 📊 Estructura del Proyecto

```
mi-app-docker/
├── server.js           # Aplicación principal
├── package.json        # Dependencias del proyecto
├── yarn.lock          # Lockfile de Yarn
├── .yarnrc.yml        # Configuración de Yarn
├── Dockerfile         # Instrucciones Docker
├── .dockerignore      # Archivos excluidos de Docker
├── .env               # Variables de entorno (NO subir a Git)
├── .gitignore         # Archivos excluidos de Git
└── README.md          # Este archivo
```

---

## 🧪 Pruebas

### Verificar conexión a MongoDB:
```bash
curl http://localhost:3000/api/test
```

### Verificar estado del servidor:
```bash
curl http://localhost:3000/api/health
```

---

## ⚠️ Solución de Problemas

### Error: "No conectado a MongoDB"
- Verifica que tu URI de MongoDB sea correcta
- Asegúrate de que la IP esté permitida en MongoDB Atlas
- Verifica que el usuario y contraseña sean correctos

### Error: "Cannot find module"
```bash
rm -rf node_modules
yarn install
```

### Docker no puede conectarse a MongoDB
- Asegúrate de pasar las variables de entorno correctamente
- Usa la URI completa sin espacios

---

## 📚 Recursos

- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [Express.js Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Yarn Documentation](https://yarnpkg.com/)

---

## 👨‍💻 Autor

**David Cuevas**  
Universidad para cursos: https://learn.mongodb.com/

---

## 📄 Licencia

MIT License - Proyecto educativo