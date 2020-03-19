import * as winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});


export const getLogger = (tag: string) => {
    winston.loggers.add(tag, {
        format: combine(
            label({ label: tag.toUpperCase() }),
            timestamp(),
            myFormat
        ),
        transports: [
            // new (winston.transports.File)({
            //     filename: 'logs/filelog-info.log',
            //     level: 'info',
            // }),
            // new (winston.transports.File)({
            //     filename: 'logs/filelog-error.log',
            //     level: 'error'
            // }),
            new (winston.transports.Console)
        ]
    });
    return winston.loggers.get(tag)
}



