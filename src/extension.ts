import * as vscode from 'vscode';
import { LbmConnection } from './connection';
import {
  CMD,
  STREAM_MODE,
  buildFwVersionRequest,
  buildSetRunning,
  buildReplCmd,
  buildStreamCode,
  FwVersionResponse,
  GetStatsResponse,
  PrintResponse,
  SetRunningResponse,
  StreamCodeResponse,
} from './protocol';

let connection: LbmConnection | null = null;
let outputChannel: vscode.OutputChannel | null = null;

function out(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('LispBM');
  }
  return outputChannel;
}

function ensureConnection(): LbmConnection {
  if (!connection) {
    connection = new LbmConnection();

    connection.on('connected', (path: string) => {
      out().appendLine(`Connected to ${path}`);
    });

    connection.on('disconnected', () => {
      out().appendLine('Disconnected.');
    });

    connection.on(`cmd:${CMD.LISP_PRINT}`, (resp: PrintResponse) => {
      out().append(resp.text);
      // Print responses don't always end with newline; normalise output
      if (!resp.text.endsWith('\n')) {
        out().appendLine('');
      }
    });

    connection.on('error', (err: Error) => {
      out().appendLine(`[error] ${err.message}`);
    });
  }
  return connection;
}

function requireConnected(): LbmConnection | null {
  const conn = ensureConnection();
  if (!conn.isConnected()) {
    vscode.window.showErrorMessage('LispBM: not connected. Use "LispBM: Connect" first.');
    return null;
  }
  return conn;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdConnect(): Promise<void> {
  const config = vscode.workspace.getConfiguration('lispbm');
  let port = config.get<string>('serialPort') || '';
  const baudRate = config.get<number>('baudRate') ?? 115200;
  const conn = ensureConnection();

  if (!port) {
    let ports: string[];
    try {
      ports = await LbmConnection.listPorts();
    } catch (err: any) {
      vscode.window.showErrorMessage(`Failed to list serial ports: ${err.message}`);
      return;
    }
    if (ports.length === 0) {
      vscode.window.showErrorMessage('No serial ports found.');
      return;
    }
    const picked = await vscode.window.showQuickPick(ports, {
      placeHolder: 'Select serial port',
    });
    if (!picked) return;
    port = picked;
  }

  try {
    await conn.connect(port, baudRate);
    const fw = await conn.sendAndWait<FwVersionResponse>(
      buildFwVersionRequest(), CMD.FW_VERSION, 3000,
    );
    out().appendLine(
      `Device: ${fw.hwName} / ${fw.fwName} v${fw.majorVersion}.${fw.minorVersion}`,
    );
    out().show(true);
  } catch (err: any) {
    vscode.window.showErrorMessage(`LispBM: connection failed — ${err.message}`);
  }
}

async function cmdDisconnect(): Promise<void> {
  if (connection && connection.isConnected()) {
    await connection.disconnect();
  } else {
    vscode.window.showInformationMessage('LispBM: already disconnected.');
  }
}

async function cmdUpload(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('LispBM: no active editor to upload.');
    return;
  }

  const config = vscode.workspace.getConfiguration('lispbm');
  const chunkSize = config.get<number>('streamChunkSize') ?? 256;
  const fileData = Buffer.from(editor.document.getText(), 'utf8');
  const totalLen = fileData.length;

  out().appendLine(`Uploading ${totalLen} bytes from ${editor.document.fileName} ...`);
  out().show(true);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Uploading to LispBM device',
      cancellable: false,
    },
    async (progress) => {
      let offset = 0;
      while (offset < totalLen) {
        const end = Math.min(offset + chunkSize, totalLen);
        const chunk = fileData.slice(offset, end);
        const mode = offset === 0 ? STREAM_MODE.RESET_AND_LOAD : STREAM_MODE.LOAD_ON_TOP;
        const payload = buildStreamCode(offset, totalLen, mode, chunk);

        let resp: StreamCodeResponse;
        try {
          resp = await conn.sendAndWait<StreamCodeResponse>(
            payload, CMD.LISP_STREAM_CODE, 10000,
          );
        } catch (err: any) {
          vscode.window.showErrorMessage(`LispBM: upload failed — ${err.message}`);
          return;
        }

        if (resp.result !== 0) {
          vscode.window.showErrorMessage(
            `LispBM: stream error at offset ${offset}: code ${resp.result}`,
          );
          return;
        }

        offset = end;
        progress.report({ increment: (chunk.length / totalLen) * 100 });
      }
      out().appendLine('Upload complete.');
    },
  );
}

async function cmdEval(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;

  const expr = await vscode.window.showInputBox({
    placeHolder: '(+ 1 2)',
    prompt: 'LispBM expression to evaluate on device',
  });
  if (expr === undefined || expr.trim() === '') return;

  out().show(true);
  conn.send(buildReplCmd(expr));
}

async function cmdReset(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;
  out().show(true);
  conn.send(buildReplCmd(':reset'));
}

async function cmdPause(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;
  try {
    const resp = await conn.sendAndWait<SetRunningResponse>(
      buildSetRunning(false), CMD.LISP_SET_RUNNING,
    );
    out().appendLine(resp.ok ? 'Evaluator paused.' : 'Could not pause evaluator.');
  } catch (err: any) {
    vscode.window.showErrorMessage(`LispBM: ${err.message}`);
  }
}

async function cmdContinue(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;
  try {
    const resp = await conn.sendAndWait<SetRunningResponse>(
      buildSetRunning(true), CMD.LISP_SET_RUNNING,
    );
    out().appendLine(resp.ok ? 'Evaluator running.' : 'Could not resume evaluator.');
  } catch (err: any) {
    vscode.window.showErrorMessage(`LispBM: ${err.message}`);
  }
}

async function cmdGetStats(): Promise<void> {
  const conn = requireConnected();
  if (!conn) return;
  try {
    const resp = await conn.sendAndWait<GetStatsResponse>(
      Buffer.from([CMD.LISP_GET_STATS]), CMD.LISP_GET_STATS,
    );
    out().appendLine(
      `Heap: ${resp.heapUsePct.toFixed(1)}% used    Mem: ${resp.memUsePct.toFixed(1)}% used`,
    );
    out().show(true);
  } catch (err: any) {
    vscode.window.showErrorMessage(`LispBM: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Activation / deactivation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
  const commands: [string, () => Promise<void>][] = [
    ['lispbm.connect',    cmdConnect],
    ['lispbm.disconnect', cmdDisconnect],
    ['lispbm.upload',     cmdUpload],
    ['lispbm.eval',       cmdEval],
    ['lispbm.reset',      cmdReset],
    ['lispbm.pause',      cmdPause],
    ['lispbm.continue',   cmdContinue],
    ['lispbm.stats',      cmdGetStats],
  ];

  for (const [id, handler] of commands) {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  }
}

export function deactivate(): void {
  connection?.disconnect();
  outputChannel?.dispose();
}
