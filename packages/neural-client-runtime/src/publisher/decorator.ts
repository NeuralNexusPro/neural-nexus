import CommandPublisher, { CommandProtocol } from './index';

const publisher = new CommandPublisher();


const isAysnFunction = func => Object.prototype.toString.call(func) === "[object AsyncFunction]";

export default function publisherDecorator(target: any) {
  const original = target.prototype;

  for (const key of Object.getOwnPropertyNames(original)) {
    const descriptor = Object.getOwnPropertyDescriptor(original, key);
    if (descriptor && typeof descriptor.value === "function") {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const message: CommandProtocol = {
          module: target.module.toLowerCase(),
          api: key,
          from: this.container,
          payload: args
        } 
        publisher.publish(message);
        if (isAysnFunction(originalMethod)) {
          return await originalMethod.apply(this, args);
        }

        return originalMethod.apply(this, args);
      };

      Object.defineProperty(original, key, descriptor);
    }
  }

  return target;
}