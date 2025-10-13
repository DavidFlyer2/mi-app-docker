require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// URI de conexión a MongoDB - Lee desde variable de entorno
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ ERROR: MONGODB_URI no está definida en las variables de entorno');
  process.exit(1);
}

// Crear cliente de MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Variable para verificar conexión
let dbConnected = false;
let db = null;

// Función para conectar a MongoDB
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db('testdb');
    dbConnected = true;
    console.log("✅ Conectado exitosamente a MongoDB!");
    console.log(`📊 Base de datos: testdb`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    dbConnected = false;
  }
}

// Conectar al iniciar el servidor
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para verificar conexión
const checkDBConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      error: 'Servicio no disponible',
      message: 'No hay conexión con MongoDB. Verifica tu configuración.'
    });
  }
  next();
};

// Ruta principal
app.get('/', (req, res) => {
  const statusEmoji = dbConnected ? '✅' : '❌';
  const statusText = dbConnected ? 'Conectado' : 'Desconectado';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mi App Docker - David Cuevas</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        h1 { margin-top: 0; }
        .status {
          padding: 15px;
          background: rgba(255,255,255,0.2);
          border-radius: 5px;
          margin: 20px 0;
        }
        a {
          display: inline-block;
          margin: 10px 10px 10px 0;
          padding: 10px 20px;
          background: rgba(255,255,255,0.3);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: all 0.3s;
        }
        a:hover {
          background: rgba(255,255,255,0.5);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Mi App Docker + MongoDB</h1>
        <p><strong>Estudiante:</strong> David Cuevas</p>
        <div class="status">
          <strong>Estado de MongoDB:</strong> ${statusEmoji} ${statusText}
        </div>
        <h3>📍 Rutas disponibles:</h3>
        <a href="/api/test">🧪 Probar MongoDB</a>
        <a href="/api/usuarios">👥 Ver Usuarios</a>
        <a href="/api/health">💚 Estado del Servidor</a>
      </div>
    </body>
    </html>
  `);
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    mongodb: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para verificar conexión a MongoDB
app.get('/api/test', checkDBConnection, async (req, res) => {
  try {
    const collection = db.collection('usuarios');
    
    // Insertar un documento de prueba
    const testUser = {
      nombre: 'David Cuevas',
      email: 'david@ejemplo.com',
      carrera: 'Ingeniería en Sistemas',
      fecha: new Date(),
      mensaje: 'Prueba desde Docker + Render + MongoDB',
      ip: req.ip
    };
    
    const result = await collection.insertOne(testUser);
    
    // Obtener estadísticas
    const totalDocs = await collection.countDocuments();
    const ultimosDocs = await collection.find({})
      .sort({ fecha: -1 })
      .limit(5)
      .toArray();
    
    res.json({
      success: true,
      mensaje: '✅ Operación exitosa en MongoDB',
      documentoInsertado: {
        id: result.insertedId,
        ...testUser
      },
      estadisticas: {
        totalDocumentos: totalDocs,
        ultimosDocumentos: ultimosDocs
      }
    });
  } catch (error) {
    console.error('Error en /api/test:', error);
    res.status(500).json({ 
      error: 'Error en la operación de MongoDB',
      details: error.message
    });
  }
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', checkDBConnection, async (req, res) => {
  try {
    const collection = db.collection('usuarios');
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    
    const usuarios = await collection.find({})
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await collection.countDocuments();
    
    res.json({
      success: true,
      pagination: {
        total,
        limit,
        skip,
        returned: usuarios.length
      },
      usuarios
    });
  } catch (error) {
    console.error('Error en /api/usuarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuarios',
      details: error.message 
    });
  }
});

// Ruta para crear un usuario (POST)
app.post('/api/usuarios', checkDBConnection, async (req, res) => {
  try {
    const { nombre, email, carrera } = req.body;
    
    if (!nombre || !email) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'nombre y email son requeridos'
      });
    }
    
    const collection = db.collection('usuarios');
    const nuevoUsuario = {
      nombre,
      email,
      carrera: carrera || 'No especificada',
      fechaCreacion: new Date(),
      ip: req.ip
    };
    
    const result = await collection.insertOne(nuevoUsuario);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        id: result.insertedId,
        ...nuevoUsuario
      }
    });
  } catch (error) {
    console.error('Error en POST /api/usuarios:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario',
      details: error.message 
    });
  }
});

// Ruta para limpiar la colección (solo en desarrollo)
app.delete('/api/usuarios/limpiar', checkDBConnection, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Operación no permitida en producción'
    });
  }
  
  try {
    const collection = db.collection('usuarios');
    const result = await collection.deleteMany({});
    
    res.json({
      success: true,
      message: 'Colección limpiada',
      documentosEliminados: result.deletedCount
    });
  } catch (error) {
    console.error('Error en DELETE /api/usuarios/limpiar:', error);
    res.status(500).json({ 
      error: 'Error al limpiar colección',
      details: error.message 
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Cerrar conexión cuando el proceso termina
const shutdown = async (signal) => {
  console.log(`\n${signal} recibido. Cerrando conexiones...`);
  try {
    await client.close();
    console.log('✅ Conexión a MongoDB cerrada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar MongoDB:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 Servidor Node.js + MongoDB             ║
║  📡 Puerto: ${PORT}                        ║
║  🌍 Entorno: ${process.env.NODE_ENV || 'development'}      ║
║  👤 Desarrollador: David Cuevas            ║
╚════════════════════════════════════════════╝
  `);
});