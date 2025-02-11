interface Window {
  ChatSDK: any;
  __authSDK: any;
  AudioContext: any;
  webkitAudioContext: any;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.gif" {
  const image: string;
  export default image;
}


// declare module "@chatui/core" {
//   export type InputVariant = 'outlined' | 'filled' | 'flushed';
// }