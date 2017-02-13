import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import styles from './chooseImg.less'
import SelectImgModal from './selectImgModal'

class ChooseImg extends React.Component {

  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  handleClick() {
    this.setState({
      visible: true
    });
    if (this.props.onChange) {
      // this.props.onChange(/*image id*/);
    }
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  render() {
    const { value } = this.props;
    const imageUrl = `api/contentImgs/getFile?id=${value}`;
    return (
      <div className={styles['avatar-uploader']} onClick={::this.handleClick}>
        {
          value > 0 ?
            <span
              style={{ backgroundImage: `url("${imageUrl}")` }}
              alt=""
              className={styles.avatar}
            /> :
            <Icon type="plus" className={styles['avatar-uploader-trigger']} />
        }
        <SelectImgModal
          visible={this.state.visible}
          onOk={::this.handleOk}
          onCancel={::this.handleCancel}
          width={864}
        />
      </div>
    )
  }
}

ChooseImg.propTypes = {
  value: PropTypes.number
}

export default ChooseImg;
