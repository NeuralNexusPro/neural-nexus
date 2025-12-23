import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Client } from "@neural-nexus/neural-channel";
import { MCPChannelMessage } from "./index";

export interface TabServerTransportOptions {
  channelId?: string;
}

export class TabServerTransport implements Transport {
  private _started = false;
  private _channelId: string;
  private _client: Client;
  private _messageHandler?: (message: MCPChannelMessage) => void;

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: string | { [key: string]: any }) => void;

  constructor(options: TabServerTransportOptions) {
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
          if (message.direction !== "client-to-server") {
            return;
          }
    
          const payload = message.payload;
          if (typeof payload === "string" && payload === "mcp-check-ready") {
            this._client!.multicast(this._channelId, "nexus-mcp-client", {
              channel: this._channelId,
              type: "mcp",
              direction: "server-to-client",
              payload: "mcp-server-ready",
            });
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
        this._client.on("mcp-check-ready", () => {
          console.log("[TabServerTransport] 接收到mcp client的初始化消息,client初始化成功");
        }); 
        this._client.on("nexus-mcp-server", this._messageHandler);
        this._started = true;
    
        setTimeout(() => {
          this._client!.multicast(this._channelId, "nexus-mcp-client", {
            channel: this._channelId,
            direction: "server-to-client",
            payload: "mcp-server-ready",
          });
        }, 10000);
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

    this._client = new Client(`${this._channelId}-server`, {
      enableLogging: true,
      group: this._channelId,
    });
    this._client.handshake();

    await this.setup();
  }

  async send(message: string | { [key: string]: any }): Promise<void> {
    if (!this._started) {
      throw new Error("Transport not started");
    }

    this._client!.multicast(this._channelId, "nexus-mcp-client", {
      channel: this._channelId,
      direction: "server-to-client",
      payload: message,
    });
  }

  async close(): Promise<void> {
    this._client!.multicast(this._channelId, "nexus-mcp-client", {
      channel: this._channelId,
      direction: "server-to-client",
      payload: "mcp-server-stopped",
    });

    console.log('server close');
    this._client.disconnect();
    this._started = false;
    this.onclose?.();
  }
}
