@echo off
echo Deploying Monday.com Barcode Generator App...
echo.
echo App ID: 10481518
echo Fixed Issues:
echo - Removed native dependencies (canvas, multer)
echo - Set port to 8080 for Monday.com deployment
echo - Added health check endpoints
echo - Pure JavaScript barcode generation
echo.
echo Starting deployment...
mapps code:push -i 10481518
echo.
echo Deployment command completed.
pause 