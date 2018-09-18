import React from 'react'
import { Breadcrumb, Tag } from 'antd'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
        <Tag color="magenta">magenta</Tag>
        <Tag color="red">red</Tag>
        <Tag color="volcano">volcano</Tag>
        <Tag color="orange">orange</Tag>
        <p>hhhhhh</p>
      </div>
    )
  }
}
