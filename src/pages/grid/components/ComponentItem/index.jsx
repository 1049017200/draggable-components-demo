import React, {Component} from 'react';
import {DragSource} from 'react-dnd'
import {Types,componentType} from '../../type';

@DragSource(Types.DRAGGABLE_COMPONENT, {
  beginDrag(props) {
    // 返回的对象可以在 monitor.getItem() 中获取到
    return {
      ...props
    }
  },
}, (connect, monitor) => ({
  // 包裹住 DOM 节点，使其可以进行拖拽操作
  connectDragSource: connect.dragSource(),
  // 是否处于拖拽状态
  isDragging: monitor.isDragging(),
}))
export default class ComponentItem extends Component {
  render() {
    const {content, img, connectDragSource} = this.props;
    return connectDragSource(
      <div>
        <div><img src={img} style={{width: 50, height: 50}}/></div>
        <div style={{marginTop: 10}}>{componentType[content]}</div>
      </div>
    )
  }
}
