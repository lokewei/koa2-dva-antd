import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Input, Icon, Spin, Button, Upload, message } from 'antd'
import PopConfirm from './popconfirm'
import classnames from 'classnames'
import styles from './commons.less'
import { query, groupList } from '../services/contentImgs'

const ImgItem = (props) => {
  const { ID, checked, handleCheck } = props;
  const classes = classnames({
    [styles.img_item_bd]: true,
    [styles.selected]: checked === true
  });
  // 这里附加一个无意义参数，避免chrome下同url的图片会有消失的问题
  const url = `url(api/contentImgs/getFile?file=${props.path}&_=${ID})`;
  return (
    <li className={styles.img_item}>
      <div className={classes} onClick={() => { handleCheck(ID) }}>
        <span
          className={styles.pic_box}
          style={{ backgroundImage: url }}
        />
        <span className={styles.lbl_content}>
          {props.file_origin_name}
        </span>
        <div className={styles.selected_mask}>
          <div className={styles.selected_mask_inner} />
          <div className={styles.selected_mask_icon} />
        </div>
      </div>
    </li>
  );
}

ImgItem.propTypes = {
  ID: PropTypes.number.isRequired,
  file_name: PropTypes.string,
  file_origin_name: PropTypes.string
}

class SelectImgModal extends React.Component {

  static defaultProps = {
    canSelectCount: 1
  };

  static show(props) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    function close() {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }
    ReactDOM.render(
      <SelectImgModal {...props} />
    , div);

    return {
      destroy: close
    };
  }

  constructor() {
    super();
    this.state = {
      loading: false,
      imgData: [],
      groupData: [],
      checkedImgs: {},
      selectCount: 0,
      currentGroup: 0
    };
  }

  componentDidMount() {
    const context = this;
    context.setState({
      loading: true
    })
    /* eslint-disable no-console */
    Promise.all([query(), groupList()]).then(([{ data: imgData }, { data: groupData }]) => {
      context.setState({
        imgData,
        groupData,
        loading: false
      })
    }).catch((error) => {
      console.error(error);
      context.setState({
        loading: false
      })
    });
  }

  getModalContent() {
    const getPopContent = () => {
      return [
        <label key="label">创建分组</label>,
        <div key="input" style={{ width: 200 }}>
          <Input size="large" />
        </div>
      ];
    }

    const { checkedImgs, currentGroup } = this.state;

    const imgItemProps = {
      // 单选一个图片元素
      handleCheck: (() => {
        const workFn = (ID) => {
          const cimgs = this.state.checkedImgs;
          const canSelectCount = this.props.canSelectCount;
          const multiMode = canSelectCount > 1;
          let curTotal = 0;
          const preCheck = cimgs[ID];
          for (const key in cimgs) {
            if (cimgs.hasOwnProperty(key)
                && cimgs[key] === true) {
              if (multiMode) {
                curTotal++
              } else {
                cimgs[key] = false;
              }
            }
          }

          /**
           * 多选模式满后只能取消后选择
           * 单选模式带自动取消功能 (全部false后，再选当前)
           */
          if (multiMode) {
            if (cimgs[ID] === true) {
              curTotal--
            }
            if (curTotal < canSelectCount) {
              cimgs[ID] = !cimgs[ID];
              curTotal++;
            }
          } else {
            cimgs[ID] = !preCheck;
            if (cimgs[ID]) {
              curTotal = 1;
            } else {
              curTotal = 0;
            }
          }
          this.setState({
            checkedImgs: cimgs,
            selectCount: curTotal
          });
        }
        return workFn.bind(this);
      })()
    }

    const uploadProps = {
      name: 'file',
      action: '/api/contentImgs/upload',
      accept: 'image/bmp,image/png,image/jpeg,image/jpg,image/gif',
      data: { groupId: currentGroup > 0 ? currentGroup : null },
      showUploadList: false,
      /* eslint-disable no-extra-bind */
      onChange: ((info) => {
        if (info.file.status === 'uploading') {
          this.setState({
            loading: true
          })
        }
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
          this.reloadImgData(currentGroup);
          this.setState({
            loading: false
          })
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
          this.setState({
            loading: false
          })
        }
      }).bind(this)
      /* eslint-enable no-extra-bind */
    }

    return (
      <Spin spinning={this.state.loading}>
        <div className={classnames(styles.img_pick_panel, styles.cell_layout)}>
          <div className={styles.inner_side}>
            <div className={styles.group_list}>
              <div className={styles.inner_menu_box}>
                <dl className={styles.inner_menu}>
                  {
                    this.state.groupData.map((record) => {
                      const className = classnames({
                        [styles.inner_menu_item]: true,
                        [styles.selected]: this.state.currentGroup === record.ID
                      });
                      const handleClick = () => {
                        this.handleSwitch(record.ID);
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
                >
                  <a className={styles.inner_menu_link}>
                    <Icon type="plus" /> 新建分组
                  </a>
                </PopConfirm>
              </div>
            </div>
          </div>
          <div className={styles.inner_main}>
            <div className={classnames(styles.sub_title_bar, styles.in_dialog)}>
              <div className={styles.title_extra}>
                <Upload {...uploadProps}>
                  <Button type="primary">
                    <Icon type="upload" /> 上传图片
                  </Button>
                </Upload>
              </div>
            </div>
            <div className={styles.img_pick_area_inner}>
              <div className={styles.img_pick}>
                {
                  this.state.imgData.map((item) => {
                    const checked = checkedImgs[item.ID] === true;
                    return (
                      <ImgItem
                        key={item.ID}
                        {...item}
                        {...imgItemProps}
                        checked={checked}
                      />
                  );
                  })
                }
              </div>
            </div>
          </div>
          <p className={styles.dialog_ft_desc}>
            已选{this.state.selectCount}个，可选{this.props.canSelectCount}个
          </p>
        </div>
      </Spin>
    );
  }

  handleSwitch(id) {
    this.setState({
      loading: true,
      currentGroup: id
    });
    this.reloadImgData(id);
  }

  reloadImgData(id) {
    query({ groupId: id }).then((result) => {
      this.setState({
        loading: false,
        imgData: result.data
      });
    }).catch((error) => {
      this.setState({
        loading: false
      });
      console.error(error);
    });
  }

  handleOk() {
    if (this.props.onOk) {
      const { checkedImgs: cimgs, imgData } = this.state;
      const checkedImgRecords = [];
      imgData.forEach((record) => {
        if (cimgs[record.ID] === true) {
          checkedImgRecords.push(record);
        }
      });
      this.setState({
        checkedImgs: {}
      });
      this.props.onOk(checkedImgRecords);
    }
  }

  render() {
    return (
      <Modal
        title="选择图片"
        wrapClassName={styles.img_pick_modal}
        {...this.props}
        onOk={::this.handleOk}
      >
        {this.getModalContent()}
      </Modal>
    );
  }
}

SelectImgModal.propTypes = {
  canSelectCount: PropTypes.number
}

export default SelectImgModal;
