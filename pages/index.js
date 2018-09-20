

import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import '../style/common.less'

export default class extends React.Component {
  render() {
    return (
      <div>
        <p>Welcome to next.js!</p>
        <Link href="/publication">
          <a>publication Page</a>
        </Link>
        <img src="/static/providence.jpg" alt="图片" />
        <Button onClick={this.handleClick}>点我请求</Button>
      </div>
    )
  }
}
