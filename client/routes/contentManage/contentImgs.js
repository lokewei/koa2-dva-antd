import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Upload, Button, Icon, Checkbox, Popover, Tooltip, message } from 'antd'
import classnames from 'classnames'
import styles from './contentImgs.less'

/**
 * 图片下面的操作按钮组
 * @param {[type]} props [description]
 */
const ImgOpts = (props) => {
  // const { id, src } = props.data;
  return (
    <ul className={classnames(styles.grid_line, styles.msg_card_opr_list)}>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Tooltip title="编辑名称">
          <span className={styles.msg_card_opr_item_inner}>
            <Icon type="edit" />
          </span>
        </Tooltip>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Tooltip title="移动分组">
          <span className={styles.msg_card_opr_item_inner}>
            <Icon type="swap" />
          </span>
        </Tooltip>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Tooltip title="删除">
          <span className={styles.msg_card_opr_item_inner}>
            <Icon type="delete" />
          </span>
        </Tooltip>
      </li>
    </ul>
  );
}


/**
 * 单个图片元素
 * @param {[type]} props [description]
 */
const ImgItem = (props) => {
  return (
    <li className={styles.img_item}>
      <div className={styles.img_item_bd}>
        <span className={styles.pic}></span>
      </div>
      <div className={styles.msg_card_ft}>
        <ImgOpts />
      </div>
    </li>
  );
}

ImgItem.propTypes = {
  data: PropTypes.object.isRequired,
  idProp: PropTypes.string,
  srcProp: PropTypes.string
}


/**
 * *******主体内容*******
 * [ContentImgs description]
 */
function ContentImgs({ dispatch, contentImgs }) {
  const { allChecked } = contentImgs;
  const uploadProps = {
    name: 'file',
    action: '/upload.do',
    headers: {
      authorization: 'authorization-text'
    },
    accept: 'image/bmp,image/png,image/jpeg,image/jpg,image/gif',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }

  const onCheckAll = (e) => {
    console.log(e.target);
    // if (allChecked !== e.target.checked) {
      dispatch({
        type: 'contentManage/contentImgs/checkAll',
        payload: e.target.checked
      });
    // }
  }
  return (
    <div className="content-inner">
      <div className={styles.img_pick_panel}>
        <div className={styles.inner_container_box}>
          <div className={styles.inner_main}>
            <div className={styles.bd}>
              <div className={styles.media_list}>
                <div className={styles.media_title}>
                  <p>全部图片</p>
                  <div className={styles.title_extra}>
                    <Upload {...uploadProps}>
                      <Button type="primary">
                        <Icon type="upload" /> 上传图片
                      </Button>
                    </Upload>
                  </div>
                </div>
                <div className={styles.media_tools}>
                  <Checkbox checked={allChecked} onChange={onCheckAll}>全选</Checkbox>
                  <Button disabled={!allChecked}>移动分组</Button>
                  <Button disabled={!allChecked}>删除</Button>
                </div>
                <div className={styles.img_pick}>
                  <ul>
                    <ImgItem data={{}} />
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inner_side}>
            <div className={styles.bd}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

ContentImgs.propTypes = {
  contentImgs: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    contentImgs: state['contentManage/contentImgs']
  };
}

export default connect(mapStateToProps)(ContentImgs)
