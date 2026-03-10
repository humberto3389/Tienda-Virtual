# Script de PowerShell para iniciar el servidor de desarrollo
# Ejecutar con: .\start-dev.ps1

Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location "D:\jerzystore"

# Verificar que estamos en el directorio correcto
if (Test-Path "package.json") {
    Write-Host "✅ Directorio correcto encontrado" -ForegroundColor Green
    
    # Instalar dependencias si es necesario
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
        npm install
    }
    
    # Iniciar el servidor de desarrollo
    Write-Host "🌐 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "❌ Error: No se encontró package.json en el directorio actual" -ForegroundColor Red
    Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Asegúrate de estar en el directorio correcto del proyecto" -ForegroundColor Yellow
}
