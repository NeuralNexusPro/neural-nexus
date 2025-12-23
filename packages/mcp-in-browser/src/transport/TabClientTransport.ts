import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Client } from "@neural-nexus/neural-channel";
import { MCPChannelMessage } from "./index";
import { getErrorMap } from "zod";

export interface TabClientTransportOptions {
  channelId?: string;
}

export class TabClientTransport implements Transport {
  private _started = false;
  private _channelId: string;
  private _client: Client;
  private _messageHandler?: (message: MCPChannelMessage) => void;

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: string | { [key: string]: any }) => void;

  constructor(options: TabClientTransportOptions) {
    this._channelId = options.channelId || "nexus-mcp";
  }

  private setup = async () => {
    return new Promise((resolve, reject) => {
      if (this._client.master) {
        this._messageHandler = (message: MCPChannelMessage) => {
          // Validate message structure
          if (message.channel !== this._channelId) {
            return;
          }
          if (message.direction !== "server-to-client") {
            return;
          }
          const payload = message.payload;
          if (typeof payload === "string" && payload === "mcp-server-ready") {
            console.log(
              "[TabClientTransport] 接收到mcp server的初始化消息,server初始化成功"
            );
            return;
          }
          if (typeof payload === "string" && payload === "mcp-server-stopped") {
            console.log(
              "[TabClientTransport] 接收到mcp server关闭消息, 同时关闭client transport"
            );
            this.close();
            return;
          }
    
          try {
            this.onmessage?.(payload);
          } catch (error) {
            this.onerror?.(
              new Error(
                `Invalid message: ${
                  error instanceof Error ? error.message : String(error)
                }`
              )
            );
          }
        };
        this._client.on("nexus-mcp-client", this._messageHandler);
        this._client.on("mcp-check-ready", () => {
          console.log("[TabClientTransport] 接收到mcp server的初始化消息,server初始化成功");
        });
    
        this._started = true;
        this.sendCheckReady();
        resolve(true);
        return;
      } else {
        requestIdleCallback(() => {
          this.setup().then(resolve).catch(reject);
        });
      } 
    })
  }

  async start(): Promise<void> {
    if (this._started) {
      throw new Error("Transport already started");
    }

    this._client = new Client(`${this._channelId}-client`, {
      enableLogging: true,
      group: this._channelId,
    });
    this._client.handshake();
    await this.setup();
  }

  private sendCheckReady() {
    this._client!.sendTo("nexus-mcp-server", {
      channel: this._channelId,
      direction: "client-to-server",
      payload: "mcp-check-ready",
    }, `${this._channelId}-server`);
    this._client.sendTo("nexus-mcp-server", {
      channel: this._channelId,
      direction: "client-to-server",
      payload: "mcp-check-ready",
    }, `${this._channelId}-server`);
  }

  async send(message: string | { [key: string]: any }): Promise<void> {
    if (!this._started) {
      throw new Error("Transport not started");
    }

    this._client!.sendTo("nexus-mcp-server", {
      channel: this._channelId,
      direction: "client-to-server",
      payload: message,
    }, `${this._channelId}-server`);
  }

  async close(): Promise<void> {

    console.log('client close');
    this._client.disconnect();
    this._started = false;
    this.onclose?.();
  }
}
