import lodash from 'lodash'

const Model = {
  namespace: 'grid',
  state: {
    components: [],
    layout:[]
  },
  effects: {
    *pushComponent({ payload }, { call, put }){
      yield put({
        type: 'changeComponents',
        payload,
      });
    },
    *deleteComponent({ payload }, { call, put }){
      const {components} = payload;
      const targetItemIndex = components.findIndex(item => item.key === payload.key)
      components.splice(targetItemIndex,1)
      yield put({
        type: 'changeComponentsDeep',
        payload:components,
      });
    },
    *pushLayout({ payload }, { call, put }){
      // 同步layout到组件上
      let layoutMap = new Map();
      let componentsWithLayout = [];
      payload.layout.map(item => layoutMap.set(item.i,item))
      payload.components.map(item => {
        componentsWithLayout.push({
          ...item,
          layout:{...layoutMap.get(item.key)}
        })
      })
      yield put({
        type: 'changeLayout',
        payload,
      });
      yield put({
        type: 'changeComponents',
        payload:{components:componentsWithLayout},
      });
    },
    *changeComponentProps({ payload }, { call, put }){
      const {components} = payload;
      const targetItemIndex = components.findIndex(item => item.key === payload.key)
      const targetItem = components[targetItemIndex];
      components[targetItemIndex] = {...targetItem,props:{...targetItem.props,...payload.props}}
      yield put({
        type: 'changeComponents',payload:components
      });
    },
  },
  reducers: {
    changeComponents(state, { payload }) {
      const newState = lodash.cloneDeep({ ...state, ...payload });
      return newState;
    },
    // 深拷贝组件列表，防止dva数据更新但页面不更新问题，仅删除组件调用
    changeComponentsDeep(state, { payload }) {
      const newState = lodash.cloneDeep({ ...state, ...payload });
      return newState;
    },
    changeLayout(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
