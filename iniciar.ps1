# Script para iniciar BusTrackSV con SQLite

Write-Host "🚌 " -ForegroundColor Cyan -NoNewline
Write-Host "Iniciando BusTrackSV con SQLite..." -ForegroundColor White
Write-Host ""

# Iniciar el servidor
Write-Host "📡 Iniciando servidor backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host '🟢 Servidor iniciado en http://localhost:4000' -ForegroundColor Green; npm start"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar el cliente
Write-Host "🌐 Iniciando cliente frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; Write-Host '🟢 Cliente iniciado en http://localhost:5173' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ " -ForegroundColor Green -NoNewline
Write-Host "Aplicación iniciada correctamente!" -ForegroundColor White
Write-Host ""
Write-Host "📝 Accede a: " -ForegroundColor Cyan -NoNewline
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")



