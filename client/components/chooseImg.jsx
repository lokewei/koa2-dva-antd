import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import styles from './chooseImg.less'

class ChooseImg extends React.Component {

  handleClick() {
    //
    if (this.props.onChange) {
      // this.props.onChange(/*image id*/);
    }
  }

  render() {
    const { value } = this.props;
    const imageUrl = `api/contentImgs/getFile?id=${value}`;
    return (
      <div className={styles['avatar-uploader']} onClick={::this.handleClick}>
        {
          value > 0 ?
            <span style={{ backgroundImage: `url("${imageUrl}")` }} alt="" className={styles.avatar} /> :
            <Icon type="plus" className={styles['avatar-uploader-trigger']} />
        }
      </div>
    )
  }
}

ChooseImg.propTypes = {
  value: PropTypes.number
}

export default ChooseImg;
