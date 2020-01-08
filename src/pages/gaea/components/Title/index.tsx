import { Button as AntButton } from 'antd';
import * as React from 'react';
import { Props, State } from './type';

export class Button extends React.Component<Props, State> {
  defaultProps = {
    editSetting: {
      key: 'my-custom-key', // Unique key.
      name: 'Custom one', // The name shown in drag menu.
      isContainer: false, // Can be dragged in.
      editors: [
        {
          field: 'title',
          text: 'Text',
          type: 'string'
        }
      ] // Tell gaea-editor, which props can be edited and how to edit it.
    }
  };
  public state = new State();

  public render() {
    return (
     <AntButton/>
    );
  }
}
