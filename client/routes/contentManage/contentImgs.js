import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Upload, Button, Input, Icon, Checkbox, Tooltip, Spin, message } from 'antd'
import classnames from 'classnames'
import styles from './contentImgs.less'
import Message from '../../components/message'
import PopConfirm from '../../components/popconfirm'

/**
 * 图片下面的操作按钮组
 * @param {[type]} props [description]
 */
const ImgOpts = (props) => {
  const { groupDatas, handleDel } = props;
  const realGroup = groupDatas.filter((record) => {
    return record.ID !== 0;
  })
  const getPopContent = (type) => {
    if (type === 1) {
      return [
        <label key="label">编辑名称</label>,
        <div key="input" style={{ width: 200 }}>
          <Input size="large" defaultValue={props.file_origin_name} />
        </div>
      ];
    } else if (type === 2) {
      if (realGroup.length > 1) {
        return (
          <div className={styles.frm_control}>
            {
              realGroup.map((record, index) => {
                return (
                  <Checkbox key={index} style={{ width: '46%' }}>{record.group_name}</Checkbox>
                )
              })
            }
          </div>
        );
      } else {
        return (
          <div>你还没有任何分组。</div>
        )
      }
    } else {
      return <p>确定删除此素材吗？</p>
    }
  }

  const getPopupContainer = () => document.getElementById('imgsContent') || document.body;

  return (
    <ul className={classnames(styles.grid_line, styles.msg_card_opr_list)}>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <PopConfirm
          content={getPopContent(1)}
          getPopupContainer={getPopupContainer}
        >
          <span className={styles.msg_card_opr_item_inner}>
            <Tooltip title="编辑名称">
              <Icon type="edit" />
            </Tooltip>
          </span>
        </PopConfirm>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <PopConfirm
          content={getPopContent(2)}
          getPopupContainer={getPopupContainer}
          overlayStyle={{ width: 252 }}
        >
          <span className={styles.msg_card_opr_item_inner}>
            <Tooltip title="移动分组">
              <Icon type="swap" />
            </Tooltip>
          </span>
        </PopConfirm>
      </li>
      <li className={classnames(styles.grid_item, styles.msg_card_opr_item)}>
        <PopConfirm
          content={getPopContent(3)}
          getPopupContainer={getPopupContainer}
          onOk={() => { handleDel(props.ID); }}
        >
          <span className={styles.msg_card_opr_item_inner}>
            <Tooltip title="删除">
              <Icon type="delete" />
            </Tooltip>
          </span>
        </PopConfirm>
      </li>
    </ul>
  );
}


/**
 * 单个图片元素
 * @param {[type]} props [description]
 */
const ImgItem = (props) => {
  const { ID, state, handleCheck } = props;
  return (
    <li className={styles.img_item}>
      <div className={styles.img_item_bd}>
        <span
          className={styles.pic}
          style={{ backgroundImage: `url(api/contentImgs/getFile?file=${props.path})` }}
        />
        <span className={styles.check_content}>
          <Checkbox
            checked={state.checked}
            onChange={(e) => { handleCheck(ID, e.target.checked) }}
          >
          {props.file_origin_name}
          </Checkbox>
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

/**
 * 右边的图片组列表
 * @param {[type]} props [description]
 */
const GroupList = (props) => {
  const { data = [], current, handleSwitch } = props;
  const getPopupContainer = () => document.getElementById('imgsContent') || document.body;
  const getPopContent = () => {
    return [
      <label key="label">创建分组</label>,
      <div key="input" style={{ width: 200 }}>
        <Input size="large" />
      </div>
    ];
  }
  return (
    <div className={styles.group_list}>
      <div className={styles.inner_menu_box}>
        <dl className={styles.inner_menu}>
          {
            data.map((record) => {
              const className = classnames({
                [styles.inner_menu_item]: true,
                [styles.selected]: current === record.ID
              });
              const handleClick = () => {
                handleSwitch(record.ID);
              }
              return (
                <dd key={record.ID} className={className}>
                  <a className={styles.inner_menu_link} onClick={handleClick}>
                    <strong>{record.group_name}</strong>
                    <em>({record.count})</em>
                  </a>
                </dd>
              );
            })
          }
        </dl>
      </div>
      <div className={styles.inner_menu_item}>
        <PopConfirm
          content={getPopContent()}
          getPopupContainer={getPopupContainer}
        >
          <a className={styles.inner_menu_link}>
            <Icon type="plus" /> 新建分组
          </a>
        </PopConfirm>
      </div>
    </div>
  );
}


/**
 * *******主体内容*******
 * [ContentImgs description]
 */
function ContentImgs({ dispatch, contentImgs }) {
  const {
    allChecked,
    imageDatas,
    checkedImgs,
    groupDatas,
    loading,
    currentGroup,
    optMessage,
    messageShowing,
    messageType
  } = contentImgs;
  const uploadProps = {
    name: 'file',
    action: '/api/contentImgs/upload',
    accept: 'image/bmp,image/png,image/jpeg,image/jpg,image/gif',
    data: { groupId: currentGroup > 0 ? currentGroup : null },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'uploading') {
        dispatch({
          type: 'contentManage/contentImgs/showLoading'
        });
      }
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        dispatch({
          type: 'contentManage/contentImgs/hideLoading'
        });
        dispatch({
          type: 'contentManage/contentImgs/queryImgs'
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
        dispatch({
          type: 'contentManage/contentImgs/hideLoading'
        });
      }
    }
  }

  // 全选/反选 所有图片
  const onCheckAll = (e) => {
    dispatch({
      type: 'contentManage/contentImgs/checkAll',
      payload: e.target.checked
    });
  }
  // 切换图片分组
  const handleSwitch = (id) => {
    dispatch({
      type: 'contentManage/contentImgs/switchGroup',
      payload: id
    })
  }

  const imgItemProps = {
    groupDatas,
    // 单选一个图片元素
    handleCheck(ID, checked) {
      dispatch({
        type: 'contentManage/contentImgs/checkImgItem',
        payload: { ID, checked }
      });
    },
    // 删除一个图片元素
    handleDel(ID) {
      dispatch({
        type: 'contentManage/contentImgs/delImgItem',
        payload: ID
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Message type={messageType} message={optMessage} showing={messageShowing} />
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
                          const state = checkedImgs[item.ID];
                          return (
                            <ImgItem
                              key={item.ID}
                              {...item}
                              {...imgItemProps}
                              state={state}
                            />
                        );
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inner_side}>
              <div className={styles.bd}>
                <GroupList data={groupDatas} current={currentGroup} handleSwitch={handleSwitch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
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
