import axios from 'axios'

class Request {
  config: any;
  instance: any;
  interceptorHooks: any;
  constructor(options: any) {
    this.config = {
      baseURL: 'https://rdfa-gateway.ennew.com',
      withCredentials: true,
      interceptorHooks: {
        requestInterceptor: (config: any) => {
          // config.headers['ennunifiedcsrftoken'] = ''
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
          config.headers['X-GW-AccessKey'] = 'SgQ1mgAvdXnfNHWlMtzxdkZ7hupFxu3i'
          return config
        },
        requestInterceptorCatch: (err: any) => {
          throw err
        },
        responseInterceptor: (res: any) => {
          return res.data
        },
        responseInterceptorCatch: (err: any) => {
          throw err
        },
      },
    }
    this.instance = axios.create(this.config)
    this.interceptorHooks = this.config.interceptorHooks
    this.setupInterceptor()
  }
  createService = (options: any) => {
    this.config.baseURL = options.baseURL
    // this.config = {
    //   baseURL: options.baseURL,
    //   withCredentials: true,
    //   interceptorHooks: {
    //     requestInterceptor: (config) => {
    //       config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    //       config.headers['X-GW-AccessKey'] = ''
    //       return config
    //     },
    //     requestInterceptorCatch: (err) => {
    //       throw err
    //     },
    //     responseInterceptor: (res) => {
    //       return res.data
    //     },
    //     responseInterceptorCatch: (err) => {
    //       throw err
    //     },
    //   },
    // }
    // this.instance = axios.create(this.config)
    // this.interceptorHooks = this.config.interceptorHooks
    // this.setupInterceptor()
  }
  request = (config: any) => {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    });
  }

  setupInterceptor = () => {
    this.instance.interceptors.request.use(
      this.interceptorHooks?.requestInterceptor,
      this.interceptorHooks?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptorHooks?.responseInterceptor,
      this.interceptorHooks?.responseInterceptorCatch
    )
  }

  get = (config: any) => {
    return this.request({ ...config, method: 'GET' })
  }

  post = async (config: any) => {
    return new Promise(async (resolve, reject) => {
      const res = await this.request({ ...config, method: 'POST' })
      console.log('rrr', res)
      resolve(res) 
    })
  }
}

export default Request
