export interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
}


export function logger(module: string, enable?: boolean): Logger {
  const prefix = 'neural-channel';

  return {
    info: function(message: string) {
      const timestamp = new Date().toISOString();
      enable && console.log(`[${prefix}:${module} ${timestamp}] ${message}`);
    },
    error: function(message: string) {
      const timestamp = new Date().toISOString();
      enable && console.error(`[${prefix}:${module} ${timestamp}] ${message}`);
    },
    warn: function(message: string) {
      const timestamp = new Date().toISOString();
      enable && console.warn(`[${prefix}:${module} ${timestamp}] ${message}`);
    } 
  }
}
