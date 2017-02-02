import React from 'react';
import { Popover, Button } from 'antd';
import styles from './popconfirm.less';

class PopConfirm extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  handleOk() {
    this.setState({
      visible: false
    });
    if (!!this.props.onOk) {
      this.props.onOk();
    }
  }

  handleCancel() {
    this.setState({
      visible: false
    });
    if (!!this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleVisibleChange(visible) {
    this.setState({ visible });
  }

  render() {
    const content = (
      <div className={styles.popover_inner}>
        {this.props.content}
        <div className={styles.popover_bar}>
          <Button size="large" type="primary" onClick={::this.handleOk}>确定</Button>
          &nbsp;
          <Button size="large" type="ghost" onClick={::this.handleCancel}>取消</Button>
        </div>
      </div>
    );
    return (
      <Popover
        {...this.props}
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={::this.handleVisibleChange}
      >
      {this.props.children}
      </Popover>
    );
  }
}

export default PopConfirm;
