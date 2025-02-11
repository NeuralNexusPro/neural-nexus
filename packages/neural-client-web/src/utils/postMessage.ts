// @ts-expect-error TS(2307): Cannot find module '@/api/index' or its correspond... Remove this comment to see the full error message
import * as API from '@/api/index';

class PostMessage {
  config: any;
  hostWhiteList: any;
  store: any;
  constructor(store: any) {
    this.hostWhiteList = []
    this.store = store
    this.config = {
      appId: '',
      appName: '',
      uiConfig: {
        logo: '',
        layoutType: '',
        theme: '',
      },
      menuConfig: {},
      containerConfig: {
        type: ''
      },
      widgetConfig: {
        userInfoWidget: {}
      },
    }
  }

  on(callback: any) {
    console.log('开始监听')
    const self = this
    window.addEventListener('message',  this.receiveMessageCb.bind(self,callback), false)
  }
  async receiveMessageCb(callback: any, e: any)  {
    if(typeof e.data === 'string') {
      const res = await this.transformData(e.data)
      callback(res)
    }
    // if (this.hostWhiteList.includes(e.origin)) {
      // if (e.data.type === 'previewConfig') {
      // }
    // }
  }
  async transformData(data: any) {
    const { basicConfig, widgetConfig } = JSON.parse(data)
    const productInfo = {
      logoName: 'ency',
      logoUrl: basicConfig.logo, // logo 图片
      title: basicConfig.appName,
      isNotShowSubTitle: true, // 副标题组件是否显示
      subtitle: 'Ency Design Pro123',
      subtitleList: [basicConfig.subTitle],
    }
    const headerData = await API.shellheaderApi
    const showWidgets= headerData.operationList.map((item: any) => {
      const isShow = widgetConfig.filter((w: any) => w.status).findIndex((v: any) => v.name === item.alias 
      )
      if(isShow === -1) {
        item.isShow = false;
      } else {
        item.isShow = true;
      }
      return item;
    })
    return {...headerData, productInfo, operationList: showWidgets}
  }
}
export default PostMessage