# Test script for Barcode Generator endpoints
Write-Host "Testing Barcode Generator Endpoints..." -ForegroundColor Green

$baseUrl = "https://e26a1-service-30568196-f0fc38bd.us.monday.app"
$headers = @{
    "Content-Type" = "application/json"
}

# Test payload
$payload = @{
    payload = @{
        inputFields = @{
            sourceColumnId = "text"
            targetFileColumnId = "files"
        }
        context = @{
            boardId = "123"
            itemId = "456"
        }
        shortLivedToken = "test-token"
    }
} | ConvertTo-Json -Depth 10

Write-Host "`n1. Testing QR Code endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actions/create-qr-code" -Method POST -Headers $headers -Body $payload
    Write-Host "✅ QR Code endpoint responded" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ QR Code endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Code 128 endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actions/create-code128" -Method POST -Headers $headers -Body $payload
    Write-Host "✅ Code 128 endpoint responded" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Code 128 endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing EAN-13 endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actions/create-ean13" -Method POST -Headers $headers -Body $payload
    Write-Host "✅ EAN-13 endpoint responded" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ EAN-13 endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green
Write-Host "`n📋 Summary of endpoints:" -ForegroundColor Cyan
Write-Host "✅ QR Code: $baseUrl/api/actions/create-qr-code"
Write-Host "✅ Code 128: $baseUrl/api/actions/create-code128"
Write-Host "✅ EAN-13: $baseUrl/api/actions/create-ean13"
Write-Host "✅ EAN-8: $baseUrl/api/actions/create-ean8"
Write-Host "✅ UPC-A: $baseUrl/api/actions/create-upc-a"
Write-Host "✅ Code 39: $baseUrl/api/actions/create-code39"
Write-Host "✅ DataMatrix: $baseUrl/api/actions/create-datamatrix"