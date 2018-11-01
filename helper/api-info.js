import fetch from 'isomorphic-unfetch'
import { message } from 'antd'
import * as Promise from 'bluebird'
// 获取配置，见next.config.js
import getConfig from 'next/config'
// 默认后台地址
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()


// fetch前后的钩子
const preHooks = []
const postHooks = []

async function apiInfo(data, showError, ...args) {
  let info
  if (data.then) {
    info = data
  } else {
    // 前置钩子执行
    if (preHooks.length > 0) {
      // eslint-disable-next-line no-param-reassign
      data = await Promise.reduce(preHooks, async (d, hook) => {
        const hookRes = await hook(d, data, showError, ...args)
        return hookRes === undefined ? d : hookRes
      }, data)
    }


    // 服务端与浏览器端做不同的URL处理
    // 浏览器端会自动添加上浏览器地址栏上的URL，服务器需要走IP
    let defaltUrl
    if (typeof window !== 'undefined') {
      defaltUrl = publicRuntimeConfig.transpond.java.url
    } else {
      defaltUrl = serverRuntimeConfig.transpond.java.url
    }

    // 发起fetch请求
    const {
      url = defaltUrl,
      path = '',
      method = 'get',
      params = undefined,
    } = data

    // 打印服务端日志
    if (typeof window === 'undefined') {
      console.info('requestURL', `${url}/${path}`)
      console.info('params', JSON.stringify(params))
    }

    info = fetch(`${url}/${path}`,
      {
        method,
        body: JSON.stringify(params),
        // credentials: 'include',
      })
  }

  // 处理结果
  let rawRes
  try {
    rawRes = await info
  } catch (err) {
    // 打印服务端日志
    if (typeof window === 'undefined') {
      console.error(err)
    }
    throw err
  }

  let res
  try {
    res = await rawRes.json()
    // 打印服务端日志
    if (typeof window === 'undefined') {
      console.info('resJson：', JSON.stringify(res))
    }
  } catch (err) {
    res = {
      errno: -1,
      errmsg: '服务器响应出错',
    }
  }

  res = res || {
    errno: -1,
    errmsg: '请求失败，请重试！',
  }

  // 执行返回数据处理钩子
  if (postHooks.length > 0) {
    res = await Promise.reduce(postHooks, async (d, hook) => {
      const hookRes = await hook(d, data, showError, ...args)
      return hookRes === undefined ? d : hookRes
    }, res)
  }

  return res
}


// 返回数据处理钩子--> 处理错误状态
postHooks.push(async (res, data, showError) => {
  if (!res || !res.result || (res.result && res.result === 0)) {
    return res
  }
  if (res && res.result && res.result !== 0) {
    res.errmsg = res.resultNote
    res.errno = res.result
  }
  if (showError !== false) {
    // 服务端与浏览器端做不同处理
    if (typeof window !== 'undefined') {
      message.destroy()
      message.error(res.errmsg)
    } else {
      console.error(res)
    }
  }
  throw res
})

export default apiInfo
