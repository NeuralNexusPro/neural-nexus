import { TabClientTransport } from "./transport/TabClientTransport";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ResourceLink } from "@modelcontextprotocol/sdk/types.js";
import { ToolDefinition } from "./shared/type";

export default class NexusMcpClient {
  name: string;
  version: string;
  client: Client;
  transport: TabClientTransport;
  tools: ToolDefinition[];

  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
    this.client = new Client({
      name,
      version,
    });
  }

  async connect() {
    // const transport = new TabClientTransport({
    //   targetOrigin: "*",
    // });
    const transport = new TabClientTransport({
      channelId: `${this.name}-${this.version}`,
    });
    this.transport = transport;
    await this.client.connect(transport);
    await this.listTools();
  }

  async destroy() {
    await this.transport?.close();
    await this.client.close();
    this.tools = [];
  }

  async listTools(): Promise<ToolDefinition[]> {
    try {
      const toolsResult = await this.client.listTools();
      this.tools = toolsResult.tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description ?? "",
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      }));

      console.log("Available tools:");
      if (toolsResult.tools.length === 0) {
        console.log("  No tools available");
      } else {
        for (const tool of this.tools) {
          console.log(`  - ${tool.name}: ${tool.description}`);
        }
      }
    } catch (error) {
      console.log(`Tools not supported by this server: ${error}`);
    }
    return this.tools;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<any> {
    if (!this.client) {
      console.log("Not connected to server.");
      return;
    }
    try {
      console.log(`Calling tool '${name}' with args:`, args);
      const result = await this.client.callTool({
        name,
        arguments: args,
      });

      const resourceLinks: ResourceLink[] = [];
      return {
        content: result.content,
        contextUpdates: result.contextUpdates,
        structuredContent: result.structuredContent,
      };
    } catch (error) {
      console.log(`Error calling tool ${name}: ${error}`);
    }
  }
}
