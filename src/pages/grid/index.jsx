/**
 * 可拖拽页面示例（一期）
 * 基础框架：react-grid-layout、react-dnd、react-dnd-html5-backend、dva（组件状态管理）
 * 实现功能：
 *  1、点击或拖拽左侧组件栏中选项可实现在展示区中添加组件
 *  2、已添加的组件可进行删除操作，展示区仅剩一个组件时不可进行删除操作
 *  3、已添加的组件可进行纵向拖拽排序，暂不支持横向拖拽
 *  4、已添加的组件可纵向拖拽改变大小，暂不支持横向大小改变
 *  5、双击已添加的组件可弹出抽屉表单，表单校验暂无，改变表单项内容可实时同步到组件上
 * 其他说明：本示例基于网格布局，因此组件大小精度为行，最小高度单位为1行，横向默认占满，组件间不支持空行，若要支持占位空行，需要注册空行组件，暂不支持组件间嵌套。
 * 思路概述：组件基于components列表顺序渲染，components列表由dva进行维护，组件编辑表单采用配置->渲染模式，组件判断大量使用工厂模式，主要以switch实现。
 * 其他说明详见具体代码。
 * 开发者：zuyue
 * Date：20200108
 */
import React, {Component} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card,Row,Col,Button} from 'antd'
import Editor from './Editor';
import uuid from 'uuid';
import {connect} from "dva";
import ComponentItem from './components/ComponentItem';
import { DndProvider } from 'react-dnd';
import HTMLBackend from 'react-dnd-html5-backend';

const gridStyle = {
  width: '50%',
  textAlign: 'center',
};
@connect(({ grid }) => ({
  ...grid
}))
export default class Index extends Component{

  // 为初始组件添加layout属性，以组件原有layout为基准增补，该方法设计目的是控制整体layout，在计算新组件位置时有用
  handleComponentsList = (components) => {
    let resArr = []
    for (let i = 0; i < components.length; i++) {
      resArr.push({
        ...components[i],
        layout:{
          i:components[i].key,
          x: 0,
          y: i,
          w: 5,
          h: 2,
          minW: 5,
          maxW: 5,
          ...components[i].layout
        }
      })
    }
    return resArr;
  }

  // 获取各类型组件初始数据，在这里获取组件的原始json格式
  getComponentsByType = (type) => {
    switch (type) {
      case "Title":
        return {
          type:'Title',
          key:uuid(),
          props:{
            text:"Hello"
          }
        }
      default:{
        console.warn("此组件未注册")
      }
    }
  }

  // 添加新组件，获取对应类型组件json加入组件列表，更新dva数据
  handleAddComponents = (componentType) => {
    let components = this.props.components;
    components.push(this.getComponentsByType(componentType))
    const { dispatch } = this.props;
    dispatch({
      type: 'grid/pushComponent',
      payload: { components:this.handleComponentsList(components) },
    });
  }

  handlePageSave = () => {
    const {components,layout} = this.props;
    console.log("componentsLayout",components)
  }

  render(){
    const {components} = this.props;
    return (
      <DndProvider backend={HTMLBackend}>
      <PageHeaderWrapper  extra={[
        <Button type="primary" onClick={this.handlePageSave}>
          保存
        </Button>
      ]}>
        <Card>
          <Row gutter={16}>
            <Col span={6}>
              <Card title="基础组件" bordered={false}>
                <Card.Grid style={gridStyle} onClick={() => this.handleAddComponents("Title")}>
                  <ComponentItem content="Title" img={require('../../assets/logo.svg')}/>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={12}><Editor components={this.handleComponentsList(components)} addComponent={this.handleAddComponents} context={this}/></Col>
            <Col span={6}></Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
      </DndProvider>
    )
  }
}
