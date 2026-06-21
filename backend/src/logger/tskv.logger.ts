import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private safeValue(value: unknown): string {
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
    message: unknown,
    meta?: Record<string, unknown>,
  ) {
    const time = new Date().toISOString();
    const pid = process.pid;
    const ctx = this.context ?? (meta?.context as string | undefined) ?? '';
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

  log(message: unknown, ...optionalParams: unknown[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('log', message, meta));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    const meta: Record<string, unknown> = {};
    
    // NestJS передает в optionalParams [trace, context] или просто [context]
    if (optionalParams.length > 0) {
      const [first, second] = optionalParams;
      if (typeof first === 'string') {
        meta.trace = first;
      }
      if (typeof second === 'string') {
        meta.context = second;
      } else if (optionalParams.length === 1 && typeof first === 'string') {
        // Если передан только один строковый параметр, NestJS часто использует его как context
        meta.context = first;
      }
      meta.params = optionalParams;
    }

    process.stderr.write(this.formatMessage('error', message, meta));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stderr.write(this.formatMessage('warn', message, meta));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('debug', message, meta));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    const meta = optionalParams.length ? { params: optionalParams } : undefined;
    process.stdout.write(this.formatMessage('verbose', message, meta));
  }
}
