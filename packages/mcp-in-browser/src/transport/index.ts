export interface MCPChannelMessage {
  channel: string;
  type: "mcp" | "other";
  direction: "client-to-server" | "server-to-client";
  payload: string | { [key: string]: any };
}
export * from "./TabClientTransport.js";
export * from "./TabServerTransport.js";
