// ...existing code...
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private safeValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      return value.replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
    }
    try {
      return JSON.stringify(value).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
    } catch {
      return String(value).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
    }
  }

  private formatMessage(
    level: string,
    message: any,
    meta?: Record<string, any>,
  ) {
    const time = new Date().toISOString();
    const pid = process.pid;
    const ctx = this.context ?? meta?.context ?? '';
    const msg = this.safeValue(message);
    const fields: Record<string, string> = {
      time,
      level,
      pid: String(pid),
      message: msg,
    };
    if (ctx) fields.context = ctx;
    if (meta) {
      for (const [k, v] of Object.entries(meta)) {
        if (k === 'context') continue;
        fields[k] = this.safeValue(v);
      }
    }
    return (
      Object.entries(fields)
        .map(([k, v]) => `${k}=${v}`)
        .join('\t') + '\n'
    );
  }

  log(message: any, ...optionalParams: any[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('log', message, meta));
  }

  error(message: any, trace?: string, context?: string) {
    const meta: Record<string, any> = {};
    if (trace) meta.trace = trace;
    if (context) meta.context = context;
    process.stderr.write(this.formatMessage('error', message, meta));
  }

  warn(message: any, ...optionalParams: any[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stderr.write(this.formatMessage('warn', message, meta));
  }

  debug(message: any, ...optionalParams: any[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('debug', message, meta));
  }

  verbose(message: any, ...optionalParams: any[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('verbose', message, meta));
  }
}
