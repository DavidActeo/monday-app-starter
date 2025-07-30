# Monday.com Deployment Guide

## Native Dependencies Removed ✅

This Monday.com Barcode Generator app has been updated to remove all native dependencies that would cause deployment issues on Monday.com's platform.

### Removed Dependencies

- ❌ `canvas` (native module requiring compilation)
- ❌ `multer` (not needed for this use case)
- ❌ `jsbarcode` (was using canvas dependency)

### Current Pure JavaScript Dependencies

- ✅ `qrcode` - Pure JavaScript QR code generation
- ✅ `form-data` - For uploading files to Monday.com API
- ✅ All other dependencies are pure JavaScript

## Barcode Generation Implementation

### Supported Barcode Types

Each barcode type has its own dedicated action for better user experience:

- **QR Code**: Uses `qrcode` library to generate PNG buffers
- **Code 128**: Custom SVG generation using pure JavaScript
- **EAN-13**: Standard retail barcode format
- **EAN-8**: Compact retail barcode format
- **UPC-A**: Universal Product Code format
- **Code 39**: Alphanumeric barcode format
- **DataMatrix**: 2D matrix barcode format

All implementations use pure JavaScript with no native dependencies.

## Architecture Overview

### Separate Actions Design

The app now uses **separate actions for each barcode type** instead of a single action with a dropdown selector. This provides:

- ✅ **Better User Experience**: Users can directly select the barcode type they need
- ✅ **Cleaner UI**: No dropdown selections required
- ✅ **Specific Documentation**: Each action has tailored descriptions
- ✅ **Column Type Restrictions**: Managed in Monday.com Developer Center UI

### Action Structure

Each barcode type has:

- Dedicated API endpoint (e.g., `/api/actions/create-qr-code`)
- Specific input field descriptions
- Tailored validation for that barcode type
- Individual OPTIONS endpoints for CORS handling

## Features

- ✅ **Multiple Action Block Support**: 7 separate actions for different barcode types
- ✅ **Dynamic Field Definitions**: Column selection without hardcoded type restrictions
- ✅ **File Upload**: Direct upload to Monday.com file columns
- ✅ **Pure JavaScript**: No compilation required
- ✅ **Deployment Ready**: Compatible with Monday.com's cloud platform

## API Endpoints

### Action Block Endpoints (One per barcode type):

1. **QR Code Action**: `/api/actions/create-qr-code`
2. **Code 128 Action**: `/api/actions/create-code128`
3. **EAN-13 Action**: `/api/actions/create-ean13`
4. **EAN-8 Action**: `/api/actions/create-ean8`
5. **UPC-A Action**: `/api/actions/create-upc-a`
6. **Code 39 Action**: `/api/actions/create-code39`
7. **DataMatrix Action**: `/api/actions/create-datamatrix`

Each endpoint:

- Accepts source column ID and target file column ID
- Generates the specific barcode type
- Uploads directly to the specified Monday.com file column
- Returns success/error response with barcode metadata

### Support Endpoints:

1. **Field Definitions**: `/api/monday/fetchFieldDefs`
   - Returns all available columns for selection
   - Column type restrictions handled in Monday.com Developer Center UI
   - Used for dynamic column selection in Action Block UI

## Column Type Configuration

**Important**: Column type restrictions are **NOT** defined in the manifest or code. Instead:

1. Go to Monday.com Developer Center
2. Navigate to your app's Actions configuration
3. For each action, configure column type restrictions in the UI:
   - **Source Column**: Restrict to "Text" and "Numbers" columns
   - **Target File Column**: Restrict to "File" columns only

This approach provides more flexibility and easier maintenance.

## Deployment Commands

```bash
# Install dependencies (no compilation needed)
npm install

# Test the application
npm start

# Deploy to Monday.com
mapps code:push -i [APP_ID]
```

## Testing

The app has been tested with:

- All 7 barcode type generation (PNG/SVG formats)
- File upload functionality for each type
- Monday.com API integration
- Separate action block functionality
- Column type restriction via Developer Center UI

All tests pass without native dependencies!
