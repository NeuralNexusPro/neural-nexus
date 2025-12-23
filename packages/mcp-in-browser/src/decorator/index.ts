// mcp.decorator.ts
import { ParamType, MCPToolMetadata, McpServerMetadata } from '../shared/type';
import { Client } from '@neural-nexus/neural-channel';
import 'reflect-metadata';
import Server from '../server';
import * as _ from 'lodash';
import { set, ZodAny, ZodRawShape } from 'zod';

// Extend Function interface to include custom properties
declare global {
  interface Function {
    _mcpNamespace?: string;
    _mcpVersion?: string;
    _mcpInstructions?: string;
    _mcpParamsMetadata?: Map<string, any[]>;
  }
}




const client = new Client('mcp-decorator-client', {
  // register a group to manager different clients if you need
  group: 'mcp',
  enableLogging: true
});
client.handshake();

// 存储所有工具的元数据
export const mcpRegistry = new Map<string, McpServerMetadata>();
export const mcpServerMap = new Map<string, Server>();

export function MCPServer(namespace: string = 'default', version: string = '1.0.0', instructions: string = "") {
  return function (constructor: Function) {
    // 1. 注册命名空间到全局
    if (!mcpRegistry.has(namespace)) {
      constructor._mcpNamespace = namespace;
      constructor._mcpVersion = version;
      constructor._mcpInstructions = instructions;

      const mcpServer = new Server(namespace, version, instructions);
      mcpServerMap.set(namespace, mcpServer);
      mcpRegistry.set(namespace, {
        name: namespace,
        version,
        instructions,
        tools: []
      });
    }
    
    // 2. 从类元数据中读取暂存的方法元数据，统一注册到当前命名空间
    const classTools = Reflect.getMetadata('mcp:classTools', constructor) || [];
    const mcpServerMeta = mcpRegistry.get(namespace);
    if (mcpServerMeta) {
      // 填充方法元数据的namespace，并添加到命名空间
      classTools.forEach(tool => {
        tool.namespace = namespace;
        mcpServerMeta.tools.push(tool);
      });
    }

    const mcpTools = classTools.map(tool => {
      const { name, description = "", params, toolExecute, returnType } = tool;

      return {
        name,
        description,
        toolExecute,
        params,
        outputSchema: returnType,
        inputSchema: params.reduce((ret, el) => {
          const { name, schema } = el;

          return {
            ...ret,
            [name]: schema
          }
        }, {})
      }
    });

    const server = mcpServerMap.get(namespace);

    const setup = async () => {
      return new Promise((resolve, reject) => { 
        if (!client.master) {
          requestIdleCallback(() => setup().then(resolve).catch(reject));
        } else {
          client.send("mcp-server-connect", {
            name: mcpServerMeta?.name,
            version: mcpServerMeta?.version,
            instructions: mcpServerMeta?.instructions
          });
          resolve(true);
          return;
        }
      });
    }
    server?.registerTools(mcpTools);
    server?.connect().then(setup);

    // 保存原始的构造函数
    const originalConstructor = constructor as any;
    
    // 修改构造函数，在实例化时自动设置实例
    const newConstructor = function(...args: any[]) {
      const instance = new originalConstructor(...args);
      
      // 自动设置实例到服务器
      server?.setInstance(instance);
      
      return instance;
    };
    
    // 复制原型链
    newConstructor.prototype = originalConstructor.prototype;
    
    // 复制静态属性
    Object.setPrototypeOf(newConstructor, originalConstructor);
    
    // 清理临时元数据（可选）
    Reflect.deleteMetadata('mcp:classTools', constructor);
    
    // 返回新的构造函数
    return newConstructor;
  };
}

export function MCPTool(toolConfig: {
  description?: string;
  deprecated?: boolean;
  returnType?: ZodRawShape;
}) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const constructor = target.constructor;
    
    // 获取参数元数据（参数装饰器已执行，这里能正确获取）
    const paramsMetadata = constructor._mcpParamsMetadata?.get(methodName) || [];
    
    // 创建工具元数据（暂不注册到全局，仅存储）
    const toolMetadata: MCPToolMetadata = {
      name: methodName,
      description: toolConfig.description,
      deprecated: toolConfig.deprecated,
      params: paramsMetadata.filter(p => p !== null),
      returnType: toolConfig.returnType,
      namespace: '', // 临时空值，等待类装饰器填充
      toolExecute: descriptor.value, // 新增：工具执行函数工厂
      className: constructor.name,
      methodName
    };
    
    // 将工具元数据暂存到类的元数据中（而非直接注册到mcpRegistry）
    const classTools = Reflect.getMetadata('mcp:classTools', constructor) || [];
    classTools.push(toolMetadata);
    Reflect.defineMetadata('mcp:classTools', classTools, constructor);
    
    // 保留原始方法，修复日志中的命名空间和方法名（之前的toolConfig.name是错误的）
    // descriptor.value = toolExecute;
    return descriptor;
  };
}

function getParameterNames(func: Function): string[] {
  const fnStr = func.toString().replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ''); // 移除注释
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  return result || [];
}

// 参数装饰器（保持不变）
export function MCPParam(options: {
  schema: ZodAny;
}) {
  return function (target: any, methodName: string, parameterIndex: number) {
    const constructor = target.constructor;
    
    
    if (!constructor._mcpParamsMetadata) {
      constructor._mcpParamsMetadata = new Map();
    }
    
    const paramNames = Reflect.getOwnMetadata('parameterNames', target, methodName) || getParameterNames(target[methodName]);
    const paramName = paramNames ? paramNames[parameterIndex] : undefined;    

    // 存储元数据
    const metadata = {
      name: paramName || `param_${parameterIndex}`,
      type: options.schema,
      index: parameterIndex,
      ...options
    };    

   // 保存元数据到类
   if (!target.constructor._mcpParamsMetadata) {
      target.constructor._mcpParamsMetadata = new Map();
    }
    
    if (!target.constructor._mcpParamsMetadata.has(methodName)) {
      target.constructor._mcpParamsMetadata.set(methodName, []);
    }
    
    const params = target.constructor._mcpParamsMetadata.get(methodName);
    while (params.length <= parameterIndex) {
      params.push(null);
    }
  
    params[parameterIndex] = metadata;
  };
}