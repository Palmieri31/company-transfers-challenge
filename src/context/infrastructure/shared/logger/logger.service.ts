import {
  createLogger,
  transports,
  Logger as WinstonLogger,
  config,
} from 'winston';
import { format } from 'logform';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { Console: ConsoleTransport, File: FileTransport } = transports;

@Injectable()
export class LoggerService {
  private loggerInstance: WinstonLogger;

  constructor(private readonly configService: ConfigService) {}

  private init(): void {
    if (!this.loggerInstance) {
      const alignedWithColorsAndTime = format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      );

      this.loggerInstance = createLogger({
        levels: config.syslog.levels,
        level: this.configService.getOrThrow('LOG_SEVERITY_LEVEL'),
        format: alignedWithColorsAndTime,
        transports: [
          new ConsoleTransport(),
          //new FileTransport({ filename: 'allLogs.log' }),
        ],
      });
    }
  }

  public emerg(message: string) {
    this.init();

    this.loggerInstance.emerg(message);
  }

  public alert(message: string) {
    this.init();

    this.loggerInstance.alert(message);
  }

  public crit(message: string) {
    this.init();

    this.loggerInstance.crit(message);
  }

  public error(message: string) {
    this.init();

    this.loggerInstance.error(message);
  }

  public warning(message: string) {
    this.init();

    this.loggerInstance.warning(message);
  }

  /*
    This alias of the warning function is necessary in order to use the AWS JS SDK logging capabilities.
  */
  public warn(message: string) {
    this.warning(message);
  }

  public notice(message: string) {
    this.init();

    this.loggerInstance.notice(message);
  }

  public info(message: string) {
    this.init();

    this.loggerInstance.info(message);
  }

  public debug(message: string) {
    this.init();

    this.loggerInstance.debug(message);
  }
}
