import Client from './client';
import Server from './server';
import { MCPParam, MCPServer, MCPTool, mcpRegistry } from './decorator'

export * from './shared/type';
const Decorator = {
  MCPParam, MCPServer, MCPTool
}

export { 
  Client,
  Server,
  mcpRegistry,
  Decorator
}