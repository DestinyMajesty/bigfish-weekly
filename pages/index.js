

import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import apiInfo from '../helper/api-info'
import '../style/common.less'

export default class extends React.Component {
  static async getInitialProps() {
    const result = await apiInfo({
      path: 'weeklys',
      method: 'get',
    })
    console.log('result', result)
    return { list: result.detail.dataList }
  }

  handleClick= async () => {
    const data = await apiInfo({
      path: 'weekly',
      method: 'put',
      params: {
        name: 'D3期刊第4期',
        date: '2018-09-25',
      },
    })
    console.log('data', data)
  }

  render() {
    const renderList = weeklysList => (
      weeklysList.map(item => (
        <p key={item.id}>
          {item.title}
          <span>--------</span>
          {item.date}
        </p>
      ))
    )

    const { list } = this.props
    return (
      <div>
        <p>Welcome to next.js!</p>
        <Link href="/publication">
          <a>publication Page</a>
        </Link>
        <div>{renderList(list)}</div>
        <img src="/static/providence.jpg" alt="图片" />
        <Button onClick={this.handleClick}>点我请求</Button>
      </div>
    )
  }
}
