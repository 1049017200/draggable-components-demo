import React, {Component} from 'react';
import {Button} from 'antd'
import {connect} from "dva";

@connect(({ grid }) => ({
  ...grid
}))
export default class Title extends Component{
  /**
   * 组件内格式，editorSetting为组件编辑表单渲染依据，editors传入数组，表单可进行分组，具体如下：
   * @type {{editors: *[]}}
   */
  static editorSetting = {
    editors: [
      {
        groupName:"normal",       // 组名称，必须
        items:[
          {
            text: '标题内容',      // 表单项名称，必须
            type: 'string',       // 表单组件类型，需在Editor->getFormItem中指定渲染内容，必须
            key:'text'            // 表单项相关联的属性名，原则上应和组件中定义的属性一致，必须
          }
        ]
      },
      {
        groupName:"basic",
        items:[
          {
            text: 'boxEditor',
            type: 'number'
          }
        ]
      },
    ],
  }

  render(){
    const {text} = this.props;
    return (
      <Button>{text}</Button>
    )
  }
}
