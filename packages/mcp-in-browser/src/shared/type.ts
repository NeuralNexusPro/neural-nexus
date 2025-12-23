import { ZodAny, ZodRawShape } from "zod";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema?: ZodRawShape;
  params?: any[];
  outputSchema?: ZodRawShape;
  toolExecute?: (...args: any[]) => Promise<any> | any;
}

export interface McpServerMetadata {
  name: string;
  version: string;
  instructions: string;
  tools: MCPToolMetadata[];
}
export interface MCPToolMetadata {
  name: string;
  description?: string;
  deprecated?: boolean;
  params: any[];
  toolExecute?: (...args: any[]) => Promise<any>;
  returnType?: ZodRawShape;
  namespace: string;
  className: string;
  methodName: string;
}

export enum ParamType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
ANY = 'any'
}

export const getClientName = (name: string, version: string) => {
  return `${name}-${version}-client`;
}

export const getServerName = (name: string, version: string) => {
  return `${name}-${version}-server`;
}