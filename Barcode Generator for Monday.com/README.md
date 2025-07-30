# 📦 Barcode Generator for Monday.com

**Transform your Monday.com data into professional barcodes instantly!**

Generate QR codes, EAN-13, Code 128, UPC-A, Code 39, EAN-8, and DataMatrix barcodes directly from your Monday.com board data. Perfect for inventory management, product tracking, shipping labels, and document processing.

## 🚀 Key Features

### 7 Professional Barcode Types

- **QR Codes** - URLs, contact info, Wi-Fi credentials, any text
- **Code 128** - Inventory tracking, shipping labels, warehouse management
- **EAN-13** - Retail products, books, international trade
- **EAN-8** - Small products with limited space
- **UPC-A** - North American retail products
- **Code 39** - Industrial applications, ID cards
- **DataMatrix** - Small items, electronics, pharmaceuticals

### 🎯 Smart Automation

- **Separate Actions** - Dedicated automation for each barcode type
- **Input Validation** - Automatic format checking with helpful error messages
- **Column Type Support** - Works with text, number, email, phone columns
- **File Integration** - Saves barcodes directly to Monday.com file columns
- **Error Notifications** - Updates items with detailed error messages when validation fails

### 💼 Business Benefits

- **Inventory Management** - Generate product barcodes for tracking
- **Shipping & Logistics** - Create shipping labels and tracking codes
- **Event Management** - QR codes for tickets and check-ins
- **Document Processing** - Barcode labels for filing and organization
- **Retail Operations** - Product labels with EAN/UPC codes

## 📋 App Information

- **App ID**: 10481518
- **Version**: 1.0.0
- **Platform**: Monday.com Apps Framework
- **Technology Stack**: Node.js, Express.js, Vanilla JavaScript, CSS

## 🏗️ Project Structure

```
monday-barcode-generator/
├── index.js                 # Main application entry point
├── package.json            # Project dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore patterns
├── README.md              # This file
│
├── src/                   # Source code directory
│   ├── routes/           # API route handlers
│   │   ├── api.js        # Main API routes
│   │   ├── auth.js       # Authentication routes
│   │   └── webhooks.js   # Monday.com webhook handlers
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── validation.js # Request validation
│   │   └── errorHandler.js # Error handling middleware
│   │
│   ├── controllers/      # Business logic controllers
│   │   ├── barcodeController.js  # Barcode operations
│   │   ├── mondayController.js   # Monday.com API interactions
│   │   └── authController.js     # Authentication logic
│   │
│   ├── services/         # External service integrations
│   │   ├── mondayService.js      # Monday.com SDK wrapper
│   │   ├── barcodeService.js     # Barcode generation service
│   │   └── validationService.js  # Data validation service
│   │
│   ├── utils/            # Utility functions
│   │   ├── logger.js     # Winston logging configuration
│   │   ├── helpers.js    # General helper functions
│   │   └── constants.js  # Application constants
│   │
│   └── config/           # Configuration files
│       ├── database.js   # Database configuration (if needed)
│       ├── monday.js     # Monday.com app configuration
│       └── security.js   # Security configurations
│
├── public/               # Static files served to client
│   ├── index.html        # Main application HTML
│   ├── css/             # Stylesheets
│   │   ├── main.css     # Main application styles
│   │   └── components.css # Component-specific styles
│   │
│   ├── js/              # Client-side JavaScript
│   │   ├── app.js       # Main application JavaScript
│   │   ├── monday-sdk.js # Monday.com SDK integration
│   │   └── utils.js     # Client-side utilities
│   │
│   └── images/          # Static images and assets
│       └── logo.png     # App logo placeholder
│
└── tests/               # Test files
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── fixtures/        # Test data fixtures
```

## ✨ Key Features

### Separate Actions Architecture

This app uses **dedicated actions for each barcode type** instead of a single action with a dropdown selector:

- **QR Code Action**: Generate QR codes from any text or number data
- **Code 128 Action**: Generate Code 128 barcodes for general use
- **EAN-13 Action**: Generate standard 13-digit retail barcodes
- **EAN-8 Action**: Generate compact 8-digit retail barcodes
- **UPC-A Action**: Generate Universal Product Code barcodes
- **Code 39 Action**: Generate alphanumeric Code 39 barcodes
- **DataMatrix Action**: Generate 2D DataMatrix codes

### Benefits of Separate Actions

- ✅ **Intuitive User Experience**: Users directly select the barcode type they need
- ✅ **No Dropdown Navigation**: Eliminates extra steps in the workflow
- ✅ **Specific Descriptions**: Each action has tailored help text and validation
- ✅ **Better Organization**: Actions are clearly categorized by barcode type
- ✅ **Flexible Column Restrictions**: Column types configured in Monday.com Developer Center UI

### Pure JavaScript Implementation

- No native dependencies that require compilation
- Compatible with Monday.com's cloud deployment platform
- Uses `qrcode` library for QR codes and custom SVG generation for other types
- Direct file upload to Monday.com file columns

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Monday.com developer account
- Registered Monday.com app

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/monday-barcode-generator.git
   cd monday-barcode-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in the `.env` file.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `MONDAY_APP_ID`: Your Monday.com app ID (10481518)
- `MONDAY_CLIENT_ID`: Your Monday.com client ID
- `MONDAY_CLIENT_SECRET`: Your Monday.com client secret
- `MONDAY_SIGNING_SECRET`: Your Monday.com signing secret
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Monday.com App Configuration

This app requires the following scopes in your Monday.com developer account:

- `boards:read` - Read board information
- `boards:write` - Write to boards
- `columns:read` - Read column data
- `columns:write` - Write column data
- `items:read` - Read item data
- `items:write` - Write item data

## 📁 Key Files and Their Purpose

### Root Level Files

- **`index.js`**: Main application entry point that starts the Express server
- **`package.json`**: Contains project metadata, dependencies, and npm scripts
- **`.env.example`**: Template for environment variables (copy to `.env`)
- **`.gitignore`**: Specifies files and folders to ignore in Git

### Source Code (`/src`)

- **`/routes`**: Contains Express route handlers for different endpoints
- **`/middleware`**: Custom middleware for authentication, validation, and error handling
- **`/controllers`**: Business logic separated from route handlers
- **`/services`**: External service integrations and complex business operations
- **`/utils`**: Utility functions and helpers used throughout the application
- **`/config`**: Configuration files for different aspects of the application

### Public Assets (`/public`)

- **`index.html`**: Main HTML file served to users
- **`/css`**: Stylesheets for the frontend interface
- **`/js`**: Client-side JavaScript files
- **`/images`**: Static assets like logos and icons

## 🛠️ Development Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run the test suite
- `npm run lint`: Run ESLint for code quality
- `npm run lint:fix`: Auto-fix ESLint issues

## 🔐 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Request validation using express-validator
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in environment variables

## 📝 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/barcode/generate` - Generate barcode (placeholder)
- `GET /api/monday/boards` - Get Monday.com boards
- `POST /api/monday/items` - Create Monday.com items

### Webhook Endpoints

- `POST /webhooks/monday` - Monday.com webhook handler

## 🧪 Testing

The project includes a comprehensive testing setup:

- **Unit Tests**: Located in `/tests/unit`
- **Integration Tests**: Located in `/tests/integration`
- **Test Fixtures**: Test data in `/tests/fixtures`

Run tests with:

```bash
npm test
```

## 🚀 Deployment

### Production Deployment

1. Set environment variables for production
2. Build and optimize assets if necessary
3. Start the server with `npm start`
4. Ensure proper security configurations
5. Set up monitoring and logging

### Environment-Specific Considerations

- **Development**: Uses nodemon for auto-restart
- **Production**: Optimized for performance and security
- **Testing**: Isolated test database and configurations

## 📋 Monday.com Integration

This app integrates with Monday.com using:

- **Monday SDK**: Official Monday.com JavaScript SDK
- **Webhooks**: Real-time updates from Monday.com
- **OAuth 2.0**: Secure authentication flow
- **GraphQL API**: Monday.com's GraphQL API for data operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review the Monday.com developer docs
3. Open an issue on GitHub
4. Contact the development team

---

**Note**: This is a starter template. The actual barcode generation functionality will be implemented in future iterations following the project roadmap.
