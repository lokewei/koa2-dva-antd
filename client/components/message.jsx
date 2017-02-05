import React, { PropTypes } from 'react';
import { message } from 'antd';
import _ from 'lodash';

class Message extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      showing: false
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.showing === true
      && this.props.showing !== nextProps.showing
      && !_.isEmpty(nextProps.message)) {
      message[nextProps.type](nextProps.message);
    }
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
