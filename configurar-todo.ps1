# Script de configuracion automatica para BusTrackSV
# Ejecutar como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONFIGURACION AUTOMATICA - BUSTRACKSV" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Pedir contraseña de PostgreSQL
Write-Host "Necesito la contrasena de PostgreSQL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Abre pgAdmin y conectate para verificar cual es tu contrasena." -ForegroundColor White
Write-Host "Si no recuerdas la contrasena, presiona Enter para intentar sin contrasena." -ForegroundColor Gray
Write-Host ""

$password = Read-Host "Ingresa la contrasena de PostgreSQL (o presiona Enter para vacio)"

Write-Host ""
Write-Host "Probando conexion..." -ForegroundColor Yellow

# Buscar psql
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        break
    }
}

if (-not $psqlPath) {
    Write-Host "No se encontro psql. Continuando sin verificar..." -ForegroundColor Yellow
}
else {
    # Probar conexion
    $env:PGPASSWORD = $password
    $testResult = & $psqlPath -U postgres -d postgres -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Conexion exitosa!" -ForegroundColor Green
    }
    else {
        Write-Host "No se pudo conectar con esa contrasena." -ForegroundColor Red
        Write-Host "Continuando de todas formas..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Creando archivo .env..." -ForegroundColor Yellow

# Crear contenido del .env
$envContent = @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bustracksv
DB_USER=postgres
DB_PASSWORD=$password

PORT=4000
NODE_ENV=development
JWT_SECRET=mi_super_secreto_jwt_12345_cambiar_en_produccion

FRONTEND_URL=http://localhost:5173

EMAIL_SERVICE=development
"@

# Guardar .env
$envPath = "server\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host ".env creado!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONFIGURACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora ejecuta:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1:" -ForegroundColor White
Write-Host "cd server" -ForegroundColor Cyan
Write-Host "npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 2:" -ForegroundColor White
Write-Host "cd client" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Navegador:" -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host ""




