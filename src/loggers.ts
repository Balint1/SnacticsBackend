import * as winston from "winston";

const { combine, timestamp, label, printf } = winston.format;
const MAX_LABLE_LENGTH = 12

const center_label = (label: string) => {
    return label
        .padStart(label.length + Math.floor((MAX_LABLE_LENGTH - label.length) / 2), ' ')
        .padEnd(MAX_LABLE_LENGTH, ' ')
}
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${center_label(label)}] ${level}: ${message}`;
});



export const getLogger = (tag: string) => {
    winston.loggers.add(tag, {
        format: combine(
            label({ label: tag.toUpperCase() }),
            timestamp(),
            myFormat
        ),
        transports: [
            new (winston.transports.File)({
                filename: 'filelog-info.log',
                level: 'info',
            }),
            new (winston.transports.File)({
                filename: 'filelog-error.log',
                level: 'error'
            }),
            new (winston.transports.Console)
        ]
    });
    return winston.loggers.get(tag)
}



