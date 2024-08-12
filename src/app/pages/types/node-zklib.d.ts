declare module 'node-zklib' {
    class ZKLib {
      constructor(ip: string, port: number, timeout: number, inport: number);
      createSocket(): Promise<void>;
      getInfo(): Promise<any>;
      getUsers(): Promise<any[]>;
      getAttendances(callback?: (percent: number, total: number) => void): Promise<any[]>;
      getRealTimeLogs(callback: (data: any) => void): void;
      clearAttendanceLog(): Promise<void>;
      getTime(): Promise<Date>;
      disconnect(): Promise<void>;
    }
  
    export default ZKLib;
  }
  