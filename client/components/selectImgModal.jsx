import React, { PropTypes } from 'react'
import { Modal, Input, Icon, Spin, Button } from 'antd'
import PopConfirm from './popconfirm'
import classnames from 'classnames'
import styles from './commons.less'
import { query, groupList, delImgItem } from '../services/contentImgs'

const ImgItem = (props) => {
  const { checked } = props;
  const classes = classnames({
    [styles.img_item_bd]: true,
    [styles.selected]: checked === true
  });
  return (
    <li className={styles.img_item}>
      <div className={classes}>
        <span
          className={styles.pic_box}
          style={{ backgroundImage: `url(api/contentImgs/getFile?file=${props.path})` }}
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

  constructor() {
    super();
    this.state = {
      loading: false,
      imgData: [],
      groupData: [],
      checkedImgs: {},
      selectCount: 0,
      current: 0
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

  handleSwitch(id) {
    //
  }

  render() {
    const getPopContent = () => {
      return [
        <label key="label">创建分组</label>,
        <div key="input" style={{ width: 200 }}>
          <Input size="large" />
        </div>
      ];
    }

    const { checkedImgs } = this.state;

    const imgItemProps = {
      // 单选一个图片元素
      handleCheck(ID, checked) {
        const cimgs = this.state.checkedImgs;
        checkedImgs[ID] = checked;
        this.setState({
          checkedImgs: cimgs
        });
      }
    }

    return (
      <Modal
        title="选择图片"
        wrapClassName={styles.img_pick_modal}
        {...this.props}
      >
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
                          [styles.selected]: this.state.current === record.ID
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
                <Button type="primary">上传tup</Button>
              </div>
              <div className={styles.img_pick_area_inner}>
                <div className={styles.img_pick}>
                  {
                    this.state.imgData.map((item) => {
                      const checked = checkedImgs[item.ID];
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
      </Modal>
    );
  }
}

SelectImgModal.propTypes = {
  canSelectCount: PropTypes.number
}

export default SelectImgModal;
