#!/usr/bin/env node
/**
 * Script de prueba del health endpoint
 * Ejecutar: node scripts/test-health.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5001;

// URLs posibles para probar (los emulators pueden usar diferentes formatos)
const POSSIBLE_PATHS = [
  '/demo-atom-challenge/us-central1/api/v1/health',
  '/v1/health',
  '/demo-atom-challenge/us-central1-api/v1/health',
];

console.log('🧪 Probando Health Endpoint...\n');

// Función para probar una URL
function testUrl(path) {
  return new Promise((resolve, reject) => {
    console.log(`📍 Probando: http://${BASE_URL}:${PORT}${path}`);

    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: 'GET',
      headers: {
        Origin: 'http://localhost:4200',
      },
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      if (res.statusCode === 200) {
        console.log(`✅ Status Code: ${res.statusCode}\n`);
      } else {
        console.log(`⚠️  Status Code: ${res.statusCode}\n`);
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('📦 Response Body:');
          console.log(JSON.stringify(json, null, 2));
          console.log('');

          // Validaciones
          console.log('🔍 Validaciones:');
          console.log(`   ✅ Status es "ok": ${json.status === 'ok' ? '✓' : '✗'}`);
          console.log(`   ✅ Tiene mensaje: ${json.message ? '✓' : '✗'}`);
          console.log(`   ✅ Tiene timestamp: ${json.timestamp ? '✓' : '✗'}`);
          console.log(`   ✅ Tiene version: ${json.version ? '✓' : '✗'}`);
          console.log(
            `   ✅ CORS header presente: ${res.headers['access-control-allow-origin'] ? '✓' : '✗'}`
          );

          const timestamp = new Date(json.timestamp);
          const isValidDate = !isNaN(timestamp.getTime());
          console.log(`   ✅ Timestamp válido: ${isValidDate ? '✓' : '✗'}`);

          console.log('\n✨ Prueba completada!\n');
          resolve(true);
        } catch (error) {
          console.error('❌ Error parsing JSON:', error.message);
          console.log('Raw data:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ ${error.message}\n`);
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('   ⏱️  Timeout\n');
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Probar todas las URLs
async function testAll() {
  let success = false;

  for (const path of POSSIBLE_PATHS) {
    try {
      await testUrl(path);
      success = true;
      break;
    } catch (error) {
      // Continuar con la siguiente URL
    }
  }

  if (!success) {
    console.log('❌ No se pudo conectar a ninguna URL.\n');
    console.log('⚠️  Asegúrate de que los emulators estén corriendo:');
    console.log('   pnpm run emulators\n');
    console.log('💡 Si los emulators están corriendo, copia la URL que aparece en');
    console.log('   la salida y pruébala directamente en tu navegador.\n');
    process.exit(1);
  }
}

testAll();
