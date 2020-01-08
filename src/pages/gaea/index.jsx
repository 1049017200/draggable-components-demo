import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Editor from 'gaea-editor';
import BasicComponents from 'gaea-basic-components';
import Title from './components/Title';


export default () => (
  <PageHeaderWrapper>
    <div style={{ width: '80vw', height: '100vh' }}>
      <Editor componentClasses={[...BasicComponents]}/>
    </div>
  </PageHeaderWrapper>
);
