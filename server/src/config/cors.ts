import cors, { CorsOptions } from 'cors';
import allowedOrigins from './allowed-origins.js';
import logger from '../tools/tapeLogger.js';




const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin ?? '') !== -1 || !origin) {
            logger.debug(`Origin ${origin} Recieved by CORS`);

            callback(null, true);
        } else {
            logger.info(`Origin ${origin} not allowed by CORS`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};

export default () => cors(corsOptions);
