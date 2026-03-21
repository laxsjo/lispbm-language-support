// VESC packet command IDs used by lbm_packet_interface.c
export const CMD = {
  FW_VERSION:       0,
  LISP_SET_RUNNING: 133,
  LISP_GET_STATS:   134,
  LISP_PRINT:       135,
  LISP_REPL_CMD:    138,
  LISP_STREAM_CODE: 139,
} as const;

// Stream mode constants (passed to COMM_LISP_STREAM_CODE)
export const STREAM_MODE = {
  LOAD_ON_TOP:    0, // evaluate on top of existing environment
  RESET_AND_LOAD: 1, // restart LispBM then load
  RELOAD_FLASH:   2, // reload flash image then load
} as const;

// ---------------------------------------------------------------------------
// Request builders — each returns a payload Buffer (without framing)
// ---------------------------------------------------------------------------

export function buildFwVersionRequest(): Buffer {
  return Buffer.from([CMD.FW_VERSION]);
}

export function buildSetRunning(running: boolean): Buffer {
  return Buffer.from([CMD.LISP_SET_RUNNING, running ? 1 : 0]);
}

export function buildGetStats(): Buffer {
  return Buffer.from([CMD.LISP_GET_STATS]);
}

// Send a REPL command or special directive (:reset, :pause, :continue, :info).
export function buildReplCmd(cmd: string): Buffer {
  const str = Buffer.from(cmd, 'utf8');
  const payload = Buffer.allocUnsafe(1 + str.length + 1);
  payload[0] = CMD.LISP_REPL_CMD;
  str.copy(payload, 1);
  payload[payload.length - 1] = 0; // null terminator expected by firmware
  return payload;
}

// Build one chunk of a streaming code upload.
// offset   — byte offset of this chunk in the complete file
// totalLen — total file length in bytes
// mode     — one of STREAM_MODE values
// data     — chunk bytes
export function buildStreamCode(
  offset: number,
  totalLen: number,
  mode: number,
  data: Buffer,
): Buffer {
  const payload = Buffer.allocUnsafe(1 + 4 + 4 + 1 + data.length);
  let i = 0;
  payload[i++] = CMD.LISP_STREAM_CODE;
  payload.writeInt32BE(offset, i);   i += 4;
  payload.writeInt32BE(totalLen, i); i += 4;
  payload[i++] = mode & 0xff;
  data.copy(payload, i);
  return payload;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface FwVersionResponse {
  cmd: 0;
  majorVersion: number;
  minorVersion: number;
  hwName: string;
  fwName: string;
}

export interface SetRunningResponse {
  cmd: 133;
  ok: boolean;
}

export interface GetStatsResponse {
  cmd: 134;
  heapUsePct: number;
  memUsePct: number;
}

export interface PrintResponse {
  cmd: 135;
  text: string;
}

export interface StreamCodeResponse {
  cmd: 139;
  offset: number;
  result: number; // 0 = success, negative = error code
}

export type LbmResponse =
  | FwVersionResponse
  | SetRunningResponse
  | GetStatsResponse
  | PrintResponse
  | StreamCodeResponse;

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

export function parseResponse(payload: Buffer): LbmResponse | null {
  if (payload.length === 0) return null;
  const cmd = payload[0];
  const data = payload.slice(1);

  switch (cmd) {
    case CMD.FW_VERSION: {
      if (data.length < 3) return null;
      const majorVersion = data[0];
      const minorVersion = data[1];
      // hw_name: null-terminated string starting at data[2]
      let hwEnd = data.indexOf(0, 2);
      if (hwEnd < 0) hwEnd = data.length;
      const hwName = data.slice(2, hwEnd).toString('utf8');
      // After hw_name null terminator: 12-byte UUID + 8 flag bytes = 20 bytes, then fw_name
      const fwStart = hwEnd + 1 + 20;
      if (fwStart >= data.length) {
        return { cmd: CMD.FW_VERSION, majorVersion, minorVersion, hwName, fwName: '' };
      }
      let fwEnd = data.indexOf(0, fwStart);
      if (fwEnd < 0) fwEnd = data.length;
      const fwName = data.slice(fwStart, fwEnd).toString('utf8');
      return { cmd: CMD.FW_VERSION, majorVersion, minorVersion, hwName, fwName };
    }

    case CMD.LISP_SET_RUNNING:
      return { cmd: CMD.LISP_SET_RUNNING, ok: data.length > 0 && data[0] !== 0 };

    case CMD.LISP_GET_STATS: {
      if (data.length < 8) return null;
      const view = new DataView(data.buffer, data.byteOffset);
      const heapUsePct = view.getFloat32(0); // big-endian (default)
      const memUsePct  = view.getFloat32(4);
      return { cmd: CMD.LISP_GET_STATS, heapUsePct, memUsePct };
    }

    case CMD.LISP_PRINT: {
      let end = data.indexOf(0);
      if (end < 0) end = data.length;
      return { cmd: CMD.LISP_PRINT, text: data.slice(0, end).toString('utf8') };
    }

    case CMD.LISP_STREAM_CODE: {
      if (data.length < 6) return null;
      const offset = data.readInt32BE(0);
      const result = data.readInt16BE(4);
      return { cmd: CMD.LISP_STREAM_CODE, offset, result };
    }

    default:
      return null;
  }
}
