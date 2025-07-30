/**
 * Monday.com Barcode Generator App
 * Main application entry point and Express server configuration
 * 
 * This file sets up the Express server with all necessary middleware,
 * security configurations, and route handlers for the Monday.com app.
 */

// ==============================================
// DEPENDENCIES
// ==============================================
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// ==============================================
// INTERNAL IMPORTS
// ==============================================
const logger = require('./src/utils/logger');
const { errorHandler } = require('./src/middleware/errorHandler');

// Route imports
const apiRoutes = require('./src/routes/api-simple'); // Using simplified version for Monday.com compatibility
const authRoutes = require('./src/routes/auth');
const webhookRoutes = require('./src/routes/webhooks');

// ==============================================
// EXPRESS APP INITIALIZATION
// ==============================================
const app = express();
const PORT = 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for Monday.com deployment (fixes X-Forwarded-For header issues)
// Set to 1 to trust only the first proxy (Monday.com's load balancer)
app.set('trust proxy', 1);

// ==============================================
// SECURITY MIDDLEWARE
// ==============================================
// Helmet for security headers (Monday.com marketplace compliance)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https://cdn.monday.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.monday.com"]
    }
  },
  // HSTS enabled (Monday.com marketplace requirement)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  // Additional security headers for marketplace compliance
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// CORS configuration for Monday.com integration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from Monday.com domains and development
    const allowedOrigins = [
      'https://monday.com',
      'https://api.monday.com',
      'https://auth.monday.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// ==============================================
// RATE LIMITING - Configured for Monday.com deployment
// ==============================================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks and Monday.com webhooks
  skip: (req) => {
    return req.path === '/health' || req.path === '/' || req.path.startsWith('/webhooks/');
  },
  // Use a custom key generator that works with Monday.com's proxy setup
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if available, otherwise use IP
    return req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection.remoteAddress;
  }
});

app.use('/api/', limiter);

// ==============================================
// GENERAL MIDDLEWARE
// ==============================================
// Compression middleware for better performance
app.use(compression());

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (only in development)
if (NODE_ENV === 'development') {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Static files serving
app.use(express.static(path.join(__dirname, 'public')));

// ==============================================
// HEALTH CHECK ENDPOINT
// ==============================================
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Monday.com Barcode Generator App is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    appId: process.env.MONDAY_APP_ID,
    port: PORT
  };
  
  console.log('Health check requested:', new Date().toISOString());
  res.status(200).json(healthCheck);
});

// Root endpoint for Monday.com platform checks
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Monday.com Barcode Generator App',
    status: 'running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Redirect route for Monday.com Remote Options URL compatibility
app.get('/fetchFieldDefs', (req, res) => {
  // Redirect to the actual API endpoint
  const redirectUrl = `/api/monday/fetchFieldDefs?${new URLSearchParams(req.query).toString()}`;
  res.redirect(redirectUrl);
});

// ==============================================
// API ROUTES - Load safely
// ==============================================
try {
  // Authentication routes
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error.message);
}

try {
  // Main API routes
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded');
} catch (error) {
  console.error('❌ Failed to load API routes:', error.message);
}

try {
  // Monday.com webhook routes
  app.use('/webhooks', webhookRoutes);
  console.log('✅ Webhook routes loaded');
} catch (error) {
  console.error('❌ Failed to load webhook routes:', error.message);
}

// ==============================================
// MAIN APP ROUTE (Frontend)
// ==============================================
// Serve the main application HTML for all non-API routes
app.get('*', (req, res) => {
  // Don't serve HTML for API endpoints that don't exist
  if (req.url.startsWith('/api/') || req.url.startsWith('/auth/') || req.url.startsWith('/webhooks/')) {
    return res.status(404).json({ 
      error: 'Endpoint not found',
      message: `The requested endpoint ${req.url} does not exist`,
      code: 'ENDPOINT_NOT_FOUND'
    });
  }
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==============================================
// ERROR HANDLING MIDDLEWARE
// ==============================================
// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The API endpoint ${req.originalUrl} does not exist`,
    code: 'API_ENDPOINT_NOT_FOUND'
  });
});

// Global error handler (must be last)
try {
  app.use(errorHandler);
  console.log('✅ Global error handler loaded');
} catch (error) {
  console.error('❌ Failed to load error handler:', error.message);
  // Add basic error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
}

// ==============================================
// SERVER STARTUP
// ==============================================
// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('Server closed. Process exiting...');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcefully shutting down after timeout');
    process.exit(1);
  }, 10000);
};

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions - don't exit during startup
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit - let the server continue running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - let the server continue running
});

// Start the server IMMEDIATELY - this is critical for Monday.com deployment
console.log(`STARTING SERVER ON PORT ${PORT} - Monday.com Deployment`);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER LISTENING ON PORT ${PORT} - DEPLOYMENT SUCCESS`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Try to log with logger, but don't fail if it doesn't work
  try {
    logger.info(`Monday.com Barcode Generator App started on port ${PORT} in ${NODE_ENV} mode`);
  } catch (e) {
    console.log('Logger not available, but server is running');
  }
});

// Handle server startup errors - but don't exit immediately
server.on('error', (error) => {
  console.error('❌ SERVER STARTUP ERROR:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  // Don't exit immediately - give Monday.com time to see the error
  setTimeout(() => process.exit(1), 5000);
});

// Export the app for testing purposes
module.exports = app; 