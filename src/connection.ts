import { EventEmitter } from 'events';
import { SerialPort } from 'serialport';
import { PacketDecoder, buildPacket } from './packet';
import { parseResponse, LbmResponse } from './protocol';

export class LbmConnection extends EventEmitter {
  private port: SerialPort | null = null;
  private decoder = new PacketDecoder();

  constructor() {
    super();
    this.decoder.on('packet', (payload: Buffer) => {
      const resp = parseResponse(payload);
      if (resp) {
        this.emit('response', resp);
        this.emit(`cmd:${resp.cmd}`, resp);
      }
    });
  }

  isConnected(): boolean {
    return this.port !== null && this.port.isOpen;
  }

  async connect(path: string, baudRate: number): Promise<void> {
    if (this.port) {
      await this.disconnect();
    }
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({ path, baudRate }, (err) => {
        if (err) {
          this.port = null;
          reject(err);
          return;
        }
        this.port!.on('data', (data: Buffer) => this.decoder.feed(data));
        this.port!.on('error', (e: Error) => this.emit('error', e));
        this.port!.on('close', () => {
          this.port = null;
          this.emit('disconnected');
        });
        this.emit('connected', path);
        resolve();
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.port && this.port.isOpen) {
        this.port.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  send(payload: Buffer): void {
    if (!this.port || !this.port.isOpen) {
      throw new Error('Not connected');
    }
    this.port.write(buildPacket(payload));
  }

  // Send payload and wait for a response with the given command byte.
  sendAndWait<T extends LbmResponse>(
    payload: Buffer,
    expectedCmd: number,
    timeoutMs = 5000,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.off(`cmd:${expectedCmd}`, handler);
        reject(new Error(`Timeout waiting for cmd ${expectedCmd}`));
      }, timeoutMs);

      const handler = (resp: T) => {
        clearTimeout(timer);
        resolve(resp);
      };
      this.once(`cmd:${expectedCmd}`, handler);
      this.send(payload);
    });
  }

  static async listPorts(): Promise<string[]> {
    const ports = await SerialPort.list();
    return ports.map((p) => p.path);
  }
}
