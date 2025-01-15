export enum ChannelLifecycleMessageType {
  PAGE_LOADING_START = '@lifecycle/start_page_loading',
  PAGE_LOADING_FINISH = '@lifecycle/finish_page_loading',
  PUSH_ROUTER_STACK = '@lifecycle/push_router_stack',
  PUSH_ROUTER_STACK_WITH_VALIDATE = '@lifecycle/push_router_stack_with_validate',
  APP_DESTORY = '@lifecycle/app_destory',
  PAGE_MOUNT = '@lifecycle/page_mount',
  PAGE_ACTIVE = '@lifecycle/page_active',  
  PAGE_UNACTIVE = '@lifecycle/page_unactive',
  PAGE_UNMOUNT = '@lifecycle/page_unmount',
  PAGE_UPDATE = '@lifecycle/page_update'
}