// import { precacheAndRoute } from 'workbox-precaching';
// // import EcmSdk, { SocketEvent } from '@ennew/ecm-open-sdk';
// import io from 'socket.io-client';
// import * as uuid from 'uuid';

// precacheAndRoute(self.__WB_MANIFEST);

// self.addEventListener('install', async function () {
//   const config = {
//     // ECM 控制台注册的应用 code
//     appkey: 'test',
//     // ECM 控制台注册的应用 token
//     appsecret: '5ef50cb421b85dfc9ad70733e097c637',
//     // SDK 环境 local/dev/fat/uat/prod
//     env: 'fat',
//   };

//   const response = await fetch(`https://ennew-ecm.fat.ennew.com/open/app/getByCode?appkey=${config.appkey}&appsecret=${config.appsecret}&code=${config.appkey}`, {
//     method: 'GET', // *GET, POST, PUT, DELETE, etc.
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();
//   // console.log(data);
//   // if(!app) throw new Error(`当前应用未在 ecm 控制台注册!`);
//   const { data: app } = data;
//   const { appToChannel } = app;
//   const socketChannel = appToChannel.find(el => el.channelCode === 'websocket');

//   if (!socketChannel) throw new Error(`当前应用未注册长连接信道!`);
//   const { authorityToken } = socketChannel;
//   const { domain } = authorityToken || {};

//   const socket = io('https://ecm-gw.fat.ennew.com/', {
//     query: { domain, appkey: config.appkey, appsecret: config.appsecret },
//     transports: ['websocket'],
//   });
//   const promisifyAction = function (event, args) {
//     return new Promise((resolve, reject) => {
//       const uid = uuid.v4();
//       const timer = setTimeout(() => {
//         socket.off(event, callback);
//       }, 5000);
//       const callback = function (res) {
//         clearTimeout(timer);
//         const { success, data, id, message } = res;

//         if (!id) reject(`消息体非法! 不存在消息 id`);
//         if (id !== uid) return;
//         socket.off(event, callback);
//         if (!success) reject(message);

//         resolve(data);
//       };
//       socket.on(event, callback);
//       socket.emit(event, { ...args, id: uid });
//     });
//   };

//   const register = async function (identity) {
//     return await promisifyAction('register', { ...identity, domain });
//   };

//   socket.on('connected', async function (args) {
//     console.log('ack cb', args);
//     await register({ userId: 'gongjianb' });
//   });
//   socket.on('push', function (msg) {
//     const { content: payload, id } = msg;
//     const { content } = payload;
//     const { type, title, body, icon, image, url } = content;
//     if (type === 'notification') {
//       self.registration.showNotification(title, {
//         body,
//         icon,
//         image,
//         tag: id,
//         data: {
//           url,
//         },
//       });
//     }
//   });

//   // //建立连接
//   // ws.onopen = function(ev) {
//   //   console.log("连接成功");
//   //   ws.send(JSON.stringify({ ...args, id: uid });
//   // };

//   //接收数据
//   // ws.onmessage = function(ev) {
//   //   console.log( "接收数据",ev.data);//server--->client
//   //   //发送数据
//   //   //ws.send("client--->server");
//   //   try{
//   //     //只处理json
//   //     var json = JSON.parse(ev.data);
//   //     console.log(json);
//   //     if(json.type == "click"){
//   //       var oSpan = document.getElementById("s1");
//   //       oSpan.innerHTML = json.value;
//   //     }
//   //   }catch(e){

//   //   }
//   // };

//   // //连接关闭
//   // ws.onclose = function(evt) {
//   //   console.log("连接关闭");
//   // };

//   // this.socket = new Socket({
//   //   ...options,
//   //   appkey: this.appkey,
//   //   appsecret: this.appsecret,
//   //   env: this.env,
//   //   domain,
//   // });

//   // return this.socket;

//   // const sdk = new EcmSdk();
//   // const socketClient = await sdk.createSocket({
//   //   queryString: '/',
//   //   connectCallback: () => { console.log('connect')},
//   //   replyTimeout: 5000
//   // });

//   // socketClient.on(SocketEvent.CONNECTED, (data) => {
//   //   console.log('connected', data);
//   // });
//   // socketClient.on(SocketEvent.CONNECT_ERROR, (e) => {
//   //   console.log('connect_error', e);
//   // });
//   // socketClient.on(SocketEvent.LOGOUT, (data) => {
//   //   console.log('i am loging out', data);
//   //   // socketClient.register({ group: 'workGropA', userId });
//   // });
//   // socketClient.on(SocketEvent.DISCONNECTED, (data) => {
//   //   console.log('disconnect', data);
//   // });
//   // socketClient.onMessage((data) => {
//   //   self.postMessage(data);
//   // })
//   // // @ts-expect-error TS(2345): Argument of type '{ group: any; userId: any; }' is... Remove this comment to see the full error message
//   // await socketClient.register({ group, userId });
// });
// // self.addEventListener('activate', function () {
// //   console.log('activate')
// // });
