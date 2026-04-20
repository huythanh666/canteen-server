const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'", "'unsafe-inline'"], 
      styleSrc: ["'self'", "'unsafe-inline'"], 
      imgSrc: ["'self'", 'data:'], 
      connectSrc: ["'self'"], 
      fontSrc: ["'self'"], 
      objectSrc: ["'none'"], 
      mediaSrc: ["'self'"], 
      frameSrc: ["'self'"], 
      upgradeInsecureRequests: [], 
    },
  },
  crossOriginEmbedderPolicy: true, 
  crossOriginOpenerPolicy: { policy: 'same-origin' }, 
  crossOriginResourcePolicy: { policy: 'same-origin' }, 
  dnsPrefetchControl: { allow: false }, 
  frameguard: { action: 'deny' }, 
  hsts: {
    maxAge: 63072000, 
    includeSubDomains: true,
    preload: true,
  },
  hidePoweredBy: true, 
  ieNoOpen: true, 
  noSniff: true, 
  permittedCrossDomainPolicies: { permittedPolicies: 'none' }, 
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, 
  xssFilter: true, 
};
export default helmetConfig