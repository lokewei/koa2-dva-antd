import React, { PropTypes } from 'react';
import { message } from 'antd';
import { _isEmpty } from 'lodash/isEmpty';

class Message extends React.PureComponent {

  componentWillUpdate(nextProps) {
    /*if (this.props.message !== nextProps.message
      && !_isEmpty(nextProps.message)) {*/
      message[nextProps.type](nextProps.message);
    // }
  }

  render() {
    return <noscript />;
  }
}

Message.defaultProps = {
  message: '',
  type: 'info'
}

Message.PropTypes = {
  message: PropTypes.string,
  type: PropTypes.string
};

export default Message;
