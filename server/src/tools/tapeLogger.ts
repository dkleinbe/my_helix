
import { AsyncLocalStorage } from "node:async_hooks";
import stream from "node:stream";
import { NextFunction, Request, Response } from 'express';
import { 
  configure, 
  getConfig,
  getConsoleSink,
  getStreamSink, 
  ansiColorFormatter, 
  getLogger,
  LogRecord,
  parseLogLevel,
  lazy
} from "@logtape/logtape";
import { log } from "node:console";

export async function configureLogger() {

    await configure({
    sinks: { 
        // @ts-ignore
        stream: getStreamSink(stream.Writable.toWeb(process.stderr), {formatter: ansiColorFormatter}),
        
        my_console: getConsoleSink({
        formatter(record: LogRecord): readonly unknown[] {
            let msg = "";
            const values: unknown[] = [];
            for (let i = 0; i < record.message.length; i++) {
            if (i % 2 === 0) msg += record.message[i];
            else {
                msg += "%o";
                values.push(record.message[i]);
            }
            }
            return [
            `${record.level.toUpperCase()} %c${
                record.category.join("\xb7")
            } %c${msg}`,
            "color: gray;",
            "color: default;",
            ...values,
            ];
        }
        }),    

        my_console3: getConsoleSink({
            formatter: (record: LogRecord) => { 
                //console.log(filename(9))
                let str = ansiColorFormatter(record)
                str = (record.properties.message !== undefined) 
                    ? str.slice(0, str.length -1) + ' \x1b[34m(' + record.properties.message + ')\x1b[0m'
                    : str
                return str
            }
        }),    
        console: getConsoleSink({formatter: ansiColorFormatter}),
    },
    loggers: [
        { category: ["logtape", "meta"], sinks: ["console"] },
        { category: "my-app", sinks: ["console"], lowestLevel: "info",  },
        { category: ["my-express"], sinks: ["console"], lowestLevel: "info" },
        //{ category: ["express"], sinks: ["my_console3"], lowestLevel: "info" },
    ],
    contextLocalStorage: new AsyncLocalStorage(),
    });
}


export const logApp = getLogger(["my-app"]);

const filename = function getCallerFile(position = 4) {
  if (position >= Error.stackTraceLimit) {
    throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
  }

  const oldPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack)  => stack;
  const stack = new Error().stack;
  Error.prepareStackTrace = oldPrepareStackTrace;


  if (stack !== null && typeof stack === 'object') {
    // stack[0] holds this file
    // stack[1] holds where this function was called
    // stack[2] holds the file we're interested in
    return stack[position] ? (stack[position] as any).getFileName() + ':' + (stack[position] as any).getLineNumber() : undefined;
  }
};



class LoggerBuilder {
  private storage: AsyncLocalStorage<{ message: string; }>;

  constructor() {
    console.log(">>>>>>>>>>>>>>>>>  LogBuilder")
    this.storage = new AsyncLocalStorage();
    this.middleware = this.middleware.bind(this);
    this.message = this.message.bind(this);
    this.log = this.log.bind(this);
  }

  expressLog = getLogger("my-express")

  appLog = getLogger("my-app")

  middleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    this.log('debug', req.method, req.originalUrl, res.statusCode, 0, 'Request received');
    //this.tapeLog.error("{method} {url}", {method: req.method, url: req.originalUrl})

    this.storage.run({ message: 'Request Completed' }, () => {
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        const message = this.storage.getStore();
        const level = res.statusCode < 400 ? 'info' : 'error';
        if (message)
        {
          this.log(level, req.method, req.originalUrl, res.statusCode, responseTime, message.message);
        }
        else
        {
          this.log(level, req.method, req.originalUrl, res.statusCode, responseTime, 'no message');
        }
      });

      res.on('error', (err) => {
        const responseTime = Date.now() - startTime;
        this.log('error', req.method, req.originalUrl, res.statusCode, responseTime, 'Error occurred:', err.message);
      });

      // res.on('close', () => {
      //   const { message } = this.storage.getStore() || { message: 'Request Completed' };
      //   this.log('WRN', req.method, req.originalUrl, res.statusCode, message, 'request closed');
      // });
      next();
    });
  };

  public log = (level: string, method: string, url: string, statusCode: number, responseTime: number|undefined,  ...message: string[]) => {

    const msg = message.toString()
    this.expressLog[parseLogLevel(level)]("{method} {url} {statusCode} - {responseTime} ms \x1b[34m(\x1b[0m{message}\x1b[34m)\x1b[0m", 
        {method: method, url: url, statusCode: statusCode, responseTime, message: msg})
  };

  private appLogger = (level: string, message: string) => {
    this.appLog[parseLogLevel(level)]("{message} - {filename}", {message, filename: filename(3)})
  }

  info = (message: string) => {
    this.appLogger('info', message)
  }
  
  debug = (message: string) => {
    this.appLogger('debug', message)
  }

  error = (message: string) => {
    this.appLogger('error', message)
  }

  successReq = (req: Request, res: Response, ...message: string[]) => {
    this.log('debug', req.method, req.originalUrl, res.statusCode, 0, ...message)
  }  
  failReq = (req: Request, res: Response, ...message: string[]) => {
    this.log('warning', req.method, req.originalUrl, res.statusCode, 0, ...message)
  }  
  errorReq = (message: string) => {
    this.appLogger('error', message)
  }
  message(msg: string) {
    this.storage.enterWith({ message: msg });
  }
}
//export const log = new LoggerBuilder()

const loggerBuilder =  new LoggerBuilder();
export default loggerBuilder;
export const appLogger = loggerBuilder.appLog
//export default new LoggerBuilder();