# MCP-in-Browser

[![npm version](https://badge.fury.io/js/@neural-nexus%2Fmcp-in-browser.svg)](https://badge.fury.io/js/@neural-nexus%2Fmcp-in-browser)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A TypeScript library that enables Model Context Protocol (MCP) functionality to run natively in web browsers. MCP-in-Browser provides a decorator-based pattern for easy tool registration and management, supporting real-time tab-to-tab communication for distributed MCP functionality.

## ✨ Features

- 🌐 **Browser-Native MCP**: Run MCP protocol entirely in browser environments without Node.js dependencies
- 🎨 **Decorator-Driven**: Use TypeScript decorators for intuitive tool registration (`@MCPServer`, `@MCPTool`, `@MCPParam`)
- 📡 **Tab Communication**: Real-time browser tab-to-tab communication using Neural Channel
- 🔒 **Type Safety**: Full TypeScript support with runtime validation using Zod schemas
- ⚡ **Async/Sync Support**: Tools can be either synchronous or asynchronous functions
- 🛠 **Extensible Transport**: Pluggable transport layer with browser-specific implementations

## 📚 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Browser Integration](#browser-integration)
- [Advanced Topics](#advanced-topics)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Install Package

```bash
npm install @neural-nexus/mcp-in-browser
```

### Install Peer Dependencies

```bash
npm install @neural-nexus/neural-channel zod reflect-metadata
```

### TypeScript Configuration

Your `tsconfig.json` must include decorator support:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "module": "ESNext",
    "target": "es2019",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

### Import Reflect Metadata

Add this import at the top of your main application file:

```typescript
import 'reflect-metadata';
```

## 🎯 Quick Start

Here's a minimal example to get you started with MCP-in-Browser:

### Creating an MCP Server

```typescript
import { MCPServer, MCPTool, MCPParam } from '@neural-nexus/mcp-in-browser';
import { z } from 'zod';
import 'reflect-metadata';

@MCPServer('calculator', '1.0.0', 'Simple calculator service for basic math operations')
class CalculatorService {

  @MCPTool({
    description: 'Add two numbers together',
    returnType: {
      result: z.number().describe('The sum of the two numbers')
    }
  })
  add(
    @MCPParam({ schema: z.number().describe('First number') })
    a: number,
    @MCPParam({ schema: z.number().describe('Second number') })
    b: number
  ) {
    return { result: a + b };
  }

  @MCPTool({
    description: 'Multiply two numbers',
    returnType: {
      result: z.number().describe('The product of the two numbers')
    }
  })
  multiply(
    @MCPParam({ schema: z.number().describe('First number') })
    a: number,
    @MCPParam({ schema: z.number().describe('Second number') })
    b: number
  ) {
    return { result: a * b };
  }
}

// Create an instance to register the server
const calculator = new CalculatorService();
```

### Creating an MCP Client

```typescript
import { Client } from '@neural-nexus/mcp-in-browser';

async function connectToCalculator() {
  const client = new Client('calculator-client', '1.0.0');

  try {
    await client.connect();

    // List available tools
    const tools = await client.listTools();
    console.log('Available tools:', tools);

    // Call a tool
    const result = await client.callTool('add', { a: 5, b: 3 });
    console.log('Result:', result.content);

    // Clean up
    await client.destroy();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

connectToCalculator();
```

## 📖 API Reference

### Core Classes

#### `Client`

The MCP client for connecting to and calling tools from MCP servers.

```typescript
class Client {
  constructor(name: string, version: string)
  connect(): Promise<void>
  listTools(): Promise<ToolDefinition[]>
  callTool(name: string, args: Record<string, unknown>): Promise<any>
  destroy(): Promise<void>
}
```

#### `Server`

The MCP server for hosting tools (used internally by decorators).

```typescript
class Server {
  constructor(name: string, version: string, instructions: string)
  setInstance(instance: any): void
  registerTools(tools: ToolDefinition[]): void
  connect(): Promise<void>
}
```

### Decorators

#### `@MCPServer(namespace, version, instructions)`

Class decorator that registers a class as an MCP server.

**Parameters:**
- `namespace` (string): Unique identifier for the server
- `version` (string): Server version (semver format)
- `instructions` (string): Description of what the server provides

```typescript
@MCPServer('my-service', '1.0.0', 'Provides utility functions')
class MyService {
  // ... tool methods
}
```

#### `@MCPTool(options)`

Method decorator that registers a method as an MCP tool.

**Options:**
- `description` (string): Tool description for documentation
- `returnType` (ZodRawShape): Zod schema for return value validation
- `deprecated` (boolean, optional): Mark tool as deprecated

```typescript
@MCPTool({
  description: 'Process user input',
  returnType: {
    result: z.string().describe('Processed result')
  }
})
processInput(input: string) {
  return { result: input.toUpperCase() };
}
```

#### `@MCPParam(options)`

Parameter decorator for tool method parameters.

**Options:**
- `schema` (ZodAny): Zod schema for parameter validation

```typescript
methodName(
  @MCPParam({ schema: z.string().min(1).describe('Input text') })
  text: string
) {
  // method implementation
}
```

### Transport Classes

#### `TabClientTransport`

Browser tab communication transport for clients.

```typescript
const transport = new TabClientTransport({
  channelId: 'my-channel'
});
```

#### `TabServerTransport`

Browser tab communication transport for servers.

```typescript
const transport = new TabServerTransport({
  channelId: 'my-channel'
});
```

### Type Definitions

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema?: ZodRawShape;
  outputSchema?: ZodRawShape;
  toolExecute?: (...args: any[]) => Promise<any> | any;
}

interface MCPToolMetadata {
  name: string;
  description?: string;
  deprecated?: boolean;
  params: any[];
  returnType?: ZodRawShape;
  namespace: string;
  className: string;
  methodName: string;
}
```

## 🎨 Examples

### Basic Calculator Service

```typescript
import { MCPServer, MCPTool, MCPParam } from '@neural-nexus/mcp-in-browser';
import { z } from 'zod';

@MCPServer('calculator', '1.0.0', 'Mathematical operations service')
class Calculator {

  @MCPTool({
    description: 'Calculate the power of a number',
    returnType: {
      result: z.number().describe('The result of base^exponent')
    }
  })
  power(
    @MCPParam({ schema: z.number().describe('Base number') })
    base: number,
    @MCPParam({ schema: z.number().describe('Exponent') })
    exponent: number
  ) {
    return { result: Math.pow(base, exponent) };
  }

  @MCPTool({
    description: 'Calculate square root',
    returnType: {
      result: z.number().describe('Square root of the input')
    }
  })
  sqrt(
    @MCPParam({ schema: z.number().min(0).describe('Input number (non-negative)') })
    value: number
  ) {
    return { result: Math.sqrt(value) };
  }
}

const calculator = new Calculator();
```

### Async File Operations Service

```typescript
@MCPServer('file-ops', '1.0.0', 'File operations in browser environment')
class FileOperations {

  @MCPTool({
    description: 'Read file content from File API',
    returnType: {
      content: z.string().describe('File content as text'),
      size: z.number().describe('File size in bytes'),
      type: z.string().describe('File MIME type')
    }
  })
  async readFile(
    @MCPParam({ schema: z.any().describe('File object from input element') })
    file: File
  ) {
    const content = await file.text();
    return {
      content,
      size: file.size,
      type: file.type
    };
  }

  @MCPTool({
    description: 'Parse JSON content safely',
    returnType: {
      data: z.any().describe('Parsed JSON data'),
      valid: z.boolean().describe('Whether parsing was successful')
    }
  })
  parseJSON(
    @MCPParam({ schema: z.string().describe('JSON string to parse') })
    jsonString: string
  ) {
    try {
      const data = JSON.parse(jsonString);
      return { data, valid: true };
    } catch (error) {
      return {
        data: null,
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

const fileOps = new FileOperations();
```

### Complex Excalidraw Integration

Based on the DrawRuntime example pattern:

```typescript
@MCPServer('draw-agent', '1.0.0', 'Excalidraw drawing operations expert')
class DrawRuntime {
  excalidrawAPI: ExcalidrawImperativeAPI;

  constructor(excalidrawAPI: ExcalidrawImperativeAPI) {
    this.excalidrawAPI = excalidrawAPI;
  }

  @MCPTool({
    description: 'Get current canvas elements',
    returnType: {
      elements: z.array(z.any()).describe('Canvas drawing elements')
    }
  })
  getSceneElements() {
    return this.excalidrawAPI.getSceneElements();
  }

  @MCPTool({
    description: 'Add a new text element to canvas',
    returnType: {
      elements: z.array(z.any()).describe('Updated canvas elements')
    }
  })
  addText(
    @MCPParam({ schema: z.string().optional().describe('Element ID') })
    id: string,
    @MCPParam({ schema: z.number().describe('X coordinate') })
    x: number,
    @MCPParam({ schema: z.number().describe('Y coordinate') })
    y: number,
    @MCPParam({ schema: z.string().describe('Text content') })
    text: string,
    @MCPParam({ schema: z.number().optional().default(16).describe('Font size') })
    fontSize?: number
  ) {
    const element = {
      id: id || generateId(),
      type: 'text',
      x,
      y,
      text,
      fontSize: fontSize || 16,
      fontFamily: 1, // Virgil
      textAlign: 'center',
      verticalAlign: 'middle'
    };

    const existingElements = this.excalidrawAPI.getSceneElements();
    const newElements = [...existingElements, createFullExcalidrawElement(element)];

    this.excalidrawAPI.updateScene({
      elements: newElements,
      appState: this.excalidrawAPI.getAppState(),
      commitToHistory: true
    });

    return newElements;
  }
}

const drawRuntime = new DrawRuntime(excalidrawAPIRef.current);
```

## 🌐 Browser Integration

### Tab Communication Setup

The library uses the Neural Channel library for tab-to-tab communication:

```typescript
import { Client } from '@neural-nexus/neural-channel';

// The client automatically sets up communication
const client = new Client('my-app', {
  group: 'mcp',
  enableLogging: true
});

await client.handshake();
```

### Security Considerations

- **CORS Policy**: Ensure your application handles cross-origin requests properly
- **Origin Validation**: The transport validates message origins for security
- **Channel IDs**: Use unique channel IDs to avoid conflicts between different MCP services

### Error Handling

```typescript
try {
  const result = await client.callTool('methodName', params);
  console.log('Success:', result);
} catch (error) {
  if (error.message.includes('Tool not found')) {
    console.error('Tool does not exist');
  } else if (error.message.includes('Validation')) {
    console.error('Parameter validation failed');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Performance Tips

- **Connection Pooling**: Reuse client connections when possible
- **Tool Batching**: Group related tool calls to reduce communication overhead
- **Schema Optimization**: Keep Zod schemas simple for better validation performance

## 🔧 Advanced Topics

### Custom Transport Implementation

You can implement custom transport layers by following the Transport interface:

```typescript
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

class CustomTransport implements Transport {
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: string | { [key: string]: any }) => void;

  // Implement required methods
  close(): Promise<void> { /* implementation */ }
  send(message: any): Promise<void> { /* implementation */ }
}
```

### Tool Registry Management

Access the global registry for advanced scenarios:

```typescript
import { mcpRegistry } from '@neural-nexus/mcp-in-browser';

// Get all registered servers
const servers = Array.from(mcpRegistry.keys());

// Get specific server metadata
const serverMeta = mcpRegistry.get('my-server');
if (serverMeta) {
  console.log('Available tools:', serverMeta.tools);
}
```

### Complex Parameter Validation

Using advanced Zod schemas:

```typescript
@MCPTool({
  description: 'Process complex data structure',
  returnType: {
    result: z.object({
      processed: z.array(z.string()),
      metadata: z.record(z.any())
    }).describe('Processing result')
  }
})
processComplexData(
  @MCPParam({
    schema: z.object({
      items: z.array(z.string().min(1)),
      options: z.object({
        caseSensitive: z.boolean().default(false),
        maxItems: z.number().min(1).max(1000).default(100)
      }).optional()
    }).describe('Input data structure')
  })
  input: {
    items: string[];
    options?: {
      caseSensitive?: boolean;
      maxItems?: number;
    };
  }
) {
  const { items, options = {} } = input;
  const { caseSensitive = false, maxItems = 100 } = options;

  let processedItems = items.slice(0, maxItems);
  if (!caseSensitive) {
    processedItems = processedItems.map(item => item.toLowerCase());
  }

  return {
    result: {
      processed: processedItems,
      metadata: {
        originalCount: items.length,
        processedCount: processedItems.length,
        caseSensitive
      }
    }
  };
}
```

### Debugging Browser MCP

Enable logging to debug issues:

```typescript
// Enable Neural Channel logging
const client = new Client('debug-client', {
  group: 'mcp',
  enableLogging: true // This will log transport messages
});

// Add custom logging to your tools
@MCPTool({
  description: 'Debug tool with logging'
})
debugTool(
  @MCPParam({ schema: z.string() })
  input: string
) {
  console.log('[MCP Tool] debugTool called with:', input);
  const result = input.toUpperCase();
  console.log('[MCP Tool] debugTool returning:', result);
  return result;
}
```

Check browser console for:
- Transport connection messages
- Tool call requests and responses
- Validation errors
- Channel communication logs

## 🤝 Contributing

We welcome contributions to MCP-in-Browser! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/neural-nexus/mcp-in-browser.git
cd mcp-in-browser

# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run watch
```

### Project Structure

```
src/
├── client.ts              # MCP client implementation
├── server.ts              # MCP server implementation
├── decorator/
│   └── index.ts           # Decorator implementations
├── transport/
│   ├── TabClientTransport.ts
│   └── TabServerTransport.ts
├── shared/
│   └── type.ts           # Type definitions
└── index.ts              # Main exports
```

### Build Process

The project uses TypeScript compiler with these key configurations:
- **Target**: ES2019 for broad browser compatibility
- **Module**: ESNext for modern module support
- **Decorators**: Full decorator metadata support
- **Output**: Compiled JavaScript and declaration files in `lib/`

### Contributing Guidelines

1. **Fork and Branch**: Create a feature branch from `main`
2. **Code Style**: Follow existing TypeScript patterns and decorator usage
3. **Testing**: Ensure TypeScript compilation passes (`npm run build`)
4. **Documentation**: Update README.md for new features
5. **Pull Request**: Submit PR with clear description of changes

### Architectural Principles

- **Decorator-First**: All tool registration should use decorators
- **Type Safety**: Maintain strict TypeScript types throughout
- **Browser Compatible**: No Node.js dependencies in runtime code
- **Transport Agnostic**: Support pluggable transport implementations

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the MCP ecosystem. For questions and support, please open an issue on [GitHub](https://github.com/neural-nexus/mcp-in-browser).