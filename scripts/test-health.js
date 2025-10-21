#!/usr/bin/env node
/**
 * Script de prueba del health endpoint
 * Ejecutar: node scripts/test-health.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5001;
const PATH = '/demo-atom-challenge/us-central1/api/api/health';

console.log('🧪 Probando Health Endpoint...\n');
console.log(`📍 URL: http://${BASE_URL}:${PORT}${PATH}\n`);

const options = {
  hostname: BASE_URL,
  port: PORT,
  path: PATH,
  method: 'GET',
  headers: {
    Origin: 'http://localhost:4200',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  console.log(`✅ Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`);
  Object.keys(res.headers).forEach((key) => {
    console.log(`   ${key}: ${res.headers[key]}`);
  });
  console.log('');

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
    } catch (error) {
      console.error('❌ Error parsing JSON:', error.message);
      console.log('Raw data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n⚠️  Asegúrate de que los emulators estén corriendo:');
  console.log('   pnpm run emulators\n');
});

req.end();
