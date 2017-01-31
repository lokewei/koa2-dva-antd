import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Upload, Button, Input, Icon, Checkbox, Popover, Tooltip, message } from 'antd'
import classnames from 'classnames'
import styles from './contentImgs.less'

/**
 * 图片下面的操作按钮组
 * @param {[type]} props [description]
 */
const ImgOpts = (props) => {
  // const { id, src } = props.data;
  const getPopContent = (type) => {
    if (type === 1) {
      return (
        <div className={styles.popover_inner}>
          <label>编辑名称</label>
          <div style={{ width: 200 }}>
            <Input size="large" defaultValue={props.file_origin_name} />
          </div>
          <div className={styles.popover_bar}>
            <Button size="large" type="primary">确定</Button>
            &nbsp;
            <Button size="large" type="ghost">取消</Button>
          </div>
        </div>
      )
    } else if (type === 2) {

    } else {

    }
  }

  const getPopupContainer = () => document.getElementById('imgsContent') || document.body;

  return (
    <ul className={classnames(styles.grid_line, styles.msg_card_opr_list)}>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Popover
          content={getPopContent(1)}
          getPopupContainer={getPopupContainer}
          placement="bottom"
          trigger="click"
        >
          <span className={styles.msg_card_opr_item_inner}>
            <Tooltip title="编辑名称">
              <Icon type="edit" />
            </Tooltip>
          </span>
        </Popover>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Tooltip title="移动分组">
          <span className={styles.msg_card_opr_item_inner}>
            <Icon type="swap" />
          </span>
        </Tooltip>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <Popover
          content="嗯哼？"
          placement="bottom"
          trigger="click"
        >
          <span className={styles.msg_card_opr_item_inner}>
            <Tooltip title="删除">
              <Icon type="delete" />
            </Tooltip>
          </span>
        </Popover>
      </li>
    </ul>
  );
}


/**
 * 单个图片元素
 * @param {[type]} props [description]
 */
const ImgItem = (props) => {
  // const { ID } = props;
  return (
    <li className={styles.img_item}>
      <div className={styles.img_item_bd}>
        <span className={styles.pic}></span>
        <span className={styles.check_content}>
          <Checkbox>{props.file_origin_name}</Checkbox>
        </span>
      </div>
      <div className={styles.msg_card_ft}>
        <ImgOpts {...props} />
      </div>
    </li>
  );
}

ImgItem.propTypes = {
  ID: PropTypes.number.isRequired,
  file_name: PropTypes.string,
  file_origin_name: PropTypes.string
}

const GroupList = (props) => {
  return (
    <div className={styles.group_list}>
      <div className={styles.inner_menu_box}>
        <dl className={styles.inner_menu}>
          <dd className={classnames(styles.inner_menu_item, styles.selected)}>
            <a className={styles.inner_menu_link}>
              <strong>全部图片</strong>
              <em>(5)</em>
            </a>
          </dd>
          <dd className={styles.inner_menu_item}>
            <a className={styles.inner_menu_link}>
              <strong>未分组</strong>
              <em>(5)</em>
            </a>
          </dd>
          <dd className={styles.inner_menu_item}>
            <a className={styles.inner_menu_link}>
              <strong>风景图</strong>
              <em>(0)</em>
            </a>
          </dd>
        </dl>
      </div>
      <div className={styles.inner_menu_item}></div>
    </div>
  );
}


/**
 * *******主体内容*******
 * [ContentImgs description]
 */
function ContentImgs({ dispatch, contentImgs }) {
  const { allChecked, imageDatas } = contentImgs;
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
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    }
  }

  const onCheckAll = (e) => {
    dispatch({
      type: 'contentManage/contentImgs/checkAll',
      payload: e.target.checked
    });
  }
  return (
    <div className="content-inner" id="imgsContent">
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
                    {
                      imageDatas.map((item) => {
                        return <ImgItem key={item.ID} {...item} />
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inner_side}>
            <div className={styles.bd}>
              <GroupList />
            </div>
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
