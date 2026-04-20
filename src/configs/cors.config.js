const whitelist = [
    'http://localhost:8080', 
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
    optionsSuccessStatus: 200 
};

export default corsOptions