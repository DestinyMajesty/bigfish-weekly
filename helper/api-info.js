import fetch from 'isomorphic-unfetch'
import { message } from 'antd'
import * as Promise from 'bluebird'
import devConfig from '../config/env/development'
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

    // 发起fetch请求
    const {
      url = apiInfo.defaltUrl,
      path = '',
      method = 'get',
      params = undefined,
    } = data

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
    throw err
  }

  let res
  try {
    res = await rawRes.json()
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

// 默认后台地址
const {
  host,
  port,
  path,
} = devConfig.transpond.java
apiInfo.defaltUrl = `${host}:${port}/${path}`

// 返回数据处理钩子--> 处理错误状态
postHooks.push(async (res, data, showError) => {
  if (!res || !res.result || (res.result && res.result === 0)) {
    return res.data
  }
  if (res && res.result && res.result !== 0) {
    res.errmsg = res.resultNote
    res.errno = res.result
  }
  if (showError !== false) {
    // 判断是否为浏览器端
    if (typeof document === 'object') {
      message.destroy()
      message.error(res.errmsg)
    }
  }
  throw res
})

export default apiInfo
