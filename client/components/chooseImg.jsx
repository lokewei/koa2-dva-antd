import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import styles from './chooseImg.less'
import SelectImgModal from './selectImgModal'

class ChooseImg extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      visible: false,
      currentImg: null
    };
  }

  handleClick() {
    this.setState({
      visible: true
    });
  }

  handleOk(checkedImgs) {
    this.setState({
      visible: false
    });
    const one = checkedImgs[0];
    if (this.props.onChange) {
      if (one && one.ID !== this.props.value) {
        this.props.onChange(one.ID);
      }
    }
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  render() {
    const { value } = this.props;
    const imageUrl = value > 0 ? `api/contentImgs/getFile?id=${value}` : '';
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
          style={{top: 10}}
          wrapClassName="super-top-right"
        />
      </div>
    )
  }
}

ChooseImg.propTypes = {
  value: PropTypes.number
}

export default ChooseImg;
