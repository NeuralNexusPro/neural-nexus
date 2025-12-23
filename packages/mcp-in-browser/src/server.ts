import { TabServerTransport } from "./transport/TabServerTransport";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ToolDefinition } from "./shared/type";
import { z } from 'zod';
import * as _ from 'lodash';
import * as uuid from "uuid";

const isAysnFunction = func => Object.prototype.toString.call(func) === "[object AsyncFunction]";


export default class NexusMcpServer {
  name: string;
  version: string;
  server: McpServer;
  transport: TabServerTransport;
  private instance: any; // 存储类实例

  constructor(name: string, version: string, instructions: string) {
    this.name = name;
    this.version = version;
    this.server = new McpServer(
      {
        name,
        version,
      },
      {
        instructions,
      }
    );

    return this;
  }

  // 设置类实例的方法
  setInstance(instance: any) {
    this.instance = instance;
  }

  registerTools(tools: ToolDefinition[]) {
    tools.forEach((tool) => {
      try {
        this.server.registerTool(
          tool.name,
          {
            ...tool,
            title: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema,
          },
          async (...args: any): Promise<any> => {
            try {
              args.taskId = uuid.v4();
              if (tool.toolExecute && this.instance) {
                const [head] = args;
                const paramaters =
                  tool.params?.map((el) => {
                    const { name } = el;
  
                    return head[name];
                  }) || [];
                
                // 使用工厂函数创建正确的工具执行函数
                console.log(`[MCP Invoke] ${tool.name}`);
                
                // 使用正确的 this 上下文调用原始方法
                let result;
                try {
                  if (isAysnFunction(tool.toolExecute)) {
                      result = await tool.toolExecute.apply(this.instance, paramaters);
                    } else {
                      result = tool.toolExecute.apply(this.instance, paramaters);
                    }
                } catch (error) {
                  console.error(`Error executing tool ${tool.name}:`, error);
                  return {
                    content: [
                      {
                        type: "text",
                        text: `Error executing tool ${tool.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
                      }
                    ],
                    isError: true,
                  };
                }
                if (tool.outputSchema) {
                  const outputSchema = z.object(tool.outputSchema);
                  const onlyOneProperty = Object.keys(tool.outputSchema).length === 1;
                  const [ onlyOneKey ] = Object.keys(tool.outputSchema)
                  const [ onlyPropertySchema ] = Object.values(tool.outputSchema);
                  const parseResult = onlyOneProperty ? onlyPropertySchema.safeParse(result) : outputSchema.safeParse(result);
                  if (!parseResult.success) {
                    throw new Error(result.error.format())
                  } else {
                    let textResult;
                    try {
                      textResult = JSON.stringify(result);
                    } catch (e) {
                      textResult = result;
                    }
                    return {
                      content: [
                        {
                          type: "text",
                          text: `${tool.name} 执行完毕，执行结果: ${textResult}`
                        }
                      ],
                      structuredContent: onlyOneProperty ? { [onlyOneKey]: result } : result,
                    }
                  }
                }
                if (_.isString(result)) {
                  return {
                    content: [
                      {
                        type: "text",
                        text: result
                      }
                    ],
                    structuredContent: result,
                  }
                } else {
                  let textResult;
  
                  return {
                    content: [
                      {
                        type: "text",
                        text: `${tool.name} 执行完毕，执行结果: ${textResult}`
                      }
                    ],
                    structuredContent: Array.isArray(result) ? { structuredContentArray: result } : result,
                  }
                }
  
              }
              return {
                content: [
                  {
                    type: "text",
                    text: `success calling tool:${tool.name}`,
                  },
                ],
                isError: false,
              };
            } catch (e: any) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Error calling tool: ${tool.name}, detail: ${
                      e.message || e
                    }`,
                  },
                ],
                isError: true,
              };
            }
          }
        );
      } catch (e: any) {
        console.warn(e.message || e);
      }

    });
  }

  async connect() {
    // Connect to transport with CORS configuration
    // const transport = new TabServerTransport({
    //   allowedOrigins: ["*"], // Configure based on your security needs
    // });
    const transport = new TabServerTransport({
      channelId: `${this.name}-${this.version}`,
    });
    this.transport = transport;
    await this.server.connect(transport);
  }
}
