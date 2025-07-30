# Simple Barcode Test Script
Write-Host "Testing Barcode Generator Endpoints" -ForegroundColor Green

$baseUrl = "https://e26a1-service-30568196-f0fc38bd.us.monday.app"

# Test health endpoint
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -TimeoutSec 10
    Write-Host "Health Check: PASSED" -ForegroundColor Green
}
catch {
    Write-Host "Health Check: FAILED" -ForegroundColor Red
}

# Test barcode endpoints
$endpoints = @(
    "/api/actions/create-qr-code",
    "/api/actions/create-code128", 
    "/api/actions/create-ean13",
    "/api/actions/create-ean8",
    "/api/actions/create-upc-a",
    "/api/actions/create-code39",
    "/api/actions/create-datamatrix"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Body '{"test":"connectivity"}' -ContentType "application/json" -TimeoutSec 5
        Write-Host "$endpoint : CONNECTED" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 400) {
            Write-Host "$endpoint : CONNECTED (Expected 400)" -ForegroundColor Yellow
        }
        else {
            Write-Host "$endpoint : ERROR ($statusCode)" -ForegroundColor Red
        }
    }
}

Write-Host "Basic connectivity test completed" -ForegroundColor Cyan