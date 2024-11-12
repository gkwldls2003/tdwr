import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = process.env.LOG_DIR;

//운영서버에서만 로그파일 저장하도록
let transports:any = [];
if (process.env.NODE_ENV === 'development') {
  transports = [new winston.transports.Console()];
} else {
  transports = [
    // 콘솔 출력
    new winston.transports.Console(),
    
    // 일반 로그 - 매일 새로운 파일 생성
    new DailyRotateFile({
      filename: `${logDir}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    }),
    
    // 에러 로그 - 별도 파일로 저장
    new DailyRotateFile({
      filename: `${logDir}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'error'
    })
  ]
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, info, message }) => {
      return `${timestamp} ${message} ${info}`; // 날짜와 메시지만 출력
    })
  ),
  transports: transports
});

export default logger;