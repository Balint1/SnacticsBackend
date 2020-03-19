import * as winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

winston.loggers.add('socket', {
    format: combine(
        label({ label: 'SOCKET' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new (winston.transports.File)({
            filename: 'logs/filelog-info.log',
            level: 'info',
        }),
        new (winston.transports.File)({
            filename: 'logs/filelog-error.log',
            level: 'error'
        }),
        new (winston.transports.Console)
    ]
});

export const SocketLogger = winston.loggers.get('socket')


