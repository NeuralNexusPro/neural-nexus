# `neural-channel`

> TODO: description

## Neural Channel: A Channel-Based Cross Frame Communication Colution


## Overview

This project, **Neural Channel**, is designed to establish and manage channels between host-app and sub-apps and support cross frame/context communications.


## Features

- **Feature 1**: User-friendly handshake process to establish channels between the host application and sub-applications.
- **Feature 2**: Manager/Client architecture for efficient management of message channels.
- **Feature 3**: Support for message broadcasting and multicasting.
- **Feature 4**: Support for synchronous and asynchronous message reply mechanisms.
- **Feature 5**: Support for cross-context struct cloning.



## Installation

```bash
  npm install @neural-nexus/neural-channel
```


## Usage


1. Register the Manager in your host app. You can only have one Manager, and it must be set up immediately.
```typescript
import { Manager } from '@neural-nexus/neural-channel';

const manager = new Manager({
  enableLogging: true
});
manager.setup();
```

2. register Client in your sub-apps

```typescript

import { Client } from '@neural-nexus/neural-channel';

const client = new Client('clientName', {
  // register a group to manager different clients if you need
  group: 'iframe',
  enableLogging: true
});
client.handshake();
```

3. register message listener and send message, client and manager can be used in different context or frame

```typescript
// client context

client.on('hello', funciton(message: string) {
  console.log(message)
});
// client send to manager
client.send<string>('world', 'hello, i am client')
// client can send to other client
client.sendTo<string>('hello', 'hello, i am client', 'otherClient')
client.broadcast<string>('hello', 'hello, i am client');
client.multicast<string>('iframe', 'hello', 'hello, i am client');

// manager context
manager.on('world', funciton(message: string) {
  console.log(message)
});
manager.sendTo<string>('hello', 'hello, i am manager', 'clientName');
manager.broadcast<string>('hello', 'hello, i am manager');
manager.multicast<string>('iframe', 'hello, i am manager');
```