const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const medicineRouter = require('./routes/medicineRoutes');
const labTestRouter = require('./routes/labTestRoutes');
const labBookingRouter = require('./routes/labBookingRoutes');
const blogRouter = require('./routes/blogRoutes');
const orderRouter = require('./routes/orderRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const emergencyContactRouter = require('./routes/emergencyContactRoutes');
const contactRouter = require('./routes/contactRoutes');
const userRouter = require('./routes/userRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const appointmentRouter=require('./routes/appointmentRoutes')

const app = express();

app.set('trust proxy', 1);

// 1) GLOBAL MIDDLEWARES
// Enable CORS for all routes
app.use(cors());
app.options('*', cors());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "ws://localhost:*"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
      },
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);


// Body parser (reading data from body into req.body)
app.use(express.json({ limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: []
}));

// Compression
app.use(compression());

// 2) ROUTES
app.use('/api/medicines', medicineRouter);
app.use('/api/labtests', labTestRouter);
app.use('/api/labbookings', labBookingRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/emergency-contacts', emergencyContactRouter);
app.use('/api/contact', contactRouter);
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments',appointmentRouter)


// 3) Handling unhandled routes (404)
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

// 4) Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;