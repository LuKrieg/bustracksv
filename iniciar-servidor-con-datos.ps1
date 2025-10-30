# Script para iniciar el servidor con datos frescos

Write-Host "🚀 Iniciando BusTrackSV con datos completos..." -ForegroundColor Cyan
Write-Host ""

# 1. Detener procesos existentes
Write-Host "1️⃣ Deteniendo procesos Node.js existentes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*bustracksv*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Importar datos
Write-Host "`n2️⃣ Importando datos a la base de datos..." -ForegroundColor Yellow
Set-Location server
node import-super-expanded-data-sqlite.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al importar datos" -ForegroundColor Red
    exit 1
}

# 3. Iniciar backend
Write-Host "`n3️⃣ Iniciando servidor backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start" -WindowStyle Minimized
Start-Sleep -Seconds 5

# 4. Verificar backend
Write-Host "`n4️⃣ Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/paradas" -UseBasicParsing
    $paradas = $response.Content | ConvertFrom-Json
    Write-Host "✅ Backend respondiendo: $($paradas.Length) paradas disponibles" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend aún no está listo, espera unos segundos más" -ForegroundColor Yellow
}

# 5. Iniciar frontend
Set-Location ../client
Write-Host "`n5️⃣ Iniciando servidor frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "`n✅ ¡Servidores iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173 (o el puerto que indique Vite)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

