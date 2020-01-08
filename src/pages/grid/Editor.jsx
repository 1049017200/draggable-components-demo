import React, {Component} from "react";
import GridLayout from "react-grid-layout";
import {Drawer, Input, Icon, message, Row, Col, Divider} from 'antd';
import {connect} from 'dva';
import Title from './Title';
import styles from './editor.less';
import {getDeepValue} from '../../utils/utils';
import {DropTarget} from 'react-dnd';
import {Types,componentType} from './type';

@DropTarget(
  Types.DRAGGABLE_COMPONENT,
  // 接收拖拽的事件对象
  {
    drop: (props, monitor) => {
      // 用传入的上下文作为addComponent传入方法的作用域
      props.addComponent.call(props.context, monitor.getItem().content)
    }
  },
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => ({
    // 包裹住 DOM 节点，使其可以接收对应的拖拽组件
    connectDropTarget: connect.dropTarget(),
    // drag source是否在 drop target 区域
    isOver: monitor.isOver(),
    // 是否可以被放置
    canDrop: monitor.canDrop(),
  })
)
@connect(({grid}) => ({
  components: grid.components,
}))
export default class Editor extends Component {

  state = {visible: false, currentItem: {}, currentFormSetting: []};

  // 获取组件内属性配置项
  getComponentFormSetting = item => {
    switch (item.type) {
      case "Title":
        return Title.editorSetting.editors
      default:
        console.warn("未能找到该组件类型")
        return [];
    }
  }

  showDrawer = item => {
    this.setState({
      visible: true,
      currentItem: item,
      currentFormSetting: this.getComponentFormSetting(item)
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 更新layout，在effects中与组件列表同步
  handleOnLayoutChange = newlayout => {
    const {dispatch, components} = this.props;
    dispatch({
      type: 'grid/pushLayout',
      payload: {layout: newlayout, components},
    });
  }

  // 获取真正在渲染区渲染的组件
  renderComponent = item => {
    switch (item.type) {
      case "Title":
        return (
          <Title {...item.props}/>
        )
      default:
        console.warn("未能找到该组件类型")
        break;
    }
  }

  // 组件prop属性改变是调用，同步更新组件列表json，触发时间为onchange，即时生效
  handlePropChange = (e, currentItem, propName) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'grid/changeComponentProps',
      payload: {key: currentItem.key, props: {[propName]: e.target.value}, components: this.props.components},
    });
  }

  // 删除组件，至少保留一个
  handleComponentDelete = currentItem => {
    const {dispatch, components} = this.props;
    if (components.length === 1) {
      message.info("应至少保留一个组件")
      return false
    }
    dispatch({
      type: 'grid/deleteComponent',
      payload: {key: currentItem.key, components},
    });
  }

  // 获取表单项要渲染的组件，表单中应用到的组件需要在这里注册
  getFormItem = (currentItem, item) => {
    switch (item.type) {
      case "string":
        return (
          <Input placeholder="Basic usage" defaultValue={getDeepValue(currentItem, `props.${item.key}`, "")}
                 onChange={e => this.handlePropChange(e, currentItem, item.key)}/>
        )
      default:
        console.warn("未定义该类型表单组件")
    }
  }

  render() {
    const {components, connectDropTarget} = this.props
    const {currentItem, currentFormSetting} = this.state

    return connectDropTarget(
      <div>
        <GridLayout style={{backgroundColor: "#f5f5f5"}} cols={12} rowHeight={30} width={1200}
                    onLayoutChange={this.handleOnLayoutChange}>
          {components.map(item => (
            <div onDoubleClick={() => this.showDrawer(item)} key={item.key} data-grid={{...item.layout}}
                 className={styles.draggableDiv}>
              {
                this.renderComponent(item)
              }
              <div className={styles.close} onClick={() => this.handleComponentDelete(item)}>
                <Icon type="close-circle" theme="filled"/>
              </div>
            </div>
          ))}
        </GridLayout>
        <Drawer
          key={currentItem.key}
          title={`${componentType[currentItem.type]}编辑`}
          width={420}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{paddingBottom: 80}}
        >
          {currentFormSetting && currentFormSetting.map(group => (
            <div>
              <Divider orientation="left">{group.groupName}</Divider>
              {
                group.items.map(item => {
                  return (
                    <Row type="flex" justify="space-around" align="middle">
                      <Col span={8} className={styles.formLabel}>{item.text}:</Col>
                      <Col span={16}>
                        {this.getFormItem(currentItem, item)}
                      </Col>
                    </Row>
                  )
                })
              }
            </div>
          ))}
        </Drawer>
      </div>
    )
  }
}
