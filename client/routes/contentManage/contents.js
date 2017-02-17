import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Button, Row, Col,
         Table, Popconfirm, Icon,
         Input, Modal, Radio, Switch } from 'antd'
import SearchGroup from '../../components/ui/search'
import styles from './contents.less'
import RichEditor from '../../components/RichEditor'
import ChooseImg from '../../components/chooseImg'
import _isEmpty from 'lodash/isEmpty'

const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const classMap = {
  article: { title: '标题', title2: '标 题', titleAdd: '新建文章', titleModify: '修改文章' },
  destination: { title: '目的地', title2: '目的地', titleAdd: '新建目的地', titleModify: '修改目的地' },
  scenic: { title: '景点', title2: '景 点', titleAdd: '新建景点', titleModify: '修改景点' },
  restaurant: { title: '餐厅', title2: '餐 厅', titleAdd: '新建餐厅', titleModify: '修改餐厅' },
  hotel: { title: '酒店', title2: '酒 店', titleAdd: '新建酒店', titleModify: '修改酒店' },
  shopping: { title: '商店', title2: '商 店', titleAdd: '新建商店', titleModify: '修改商店' },
  feature: { title: '特色服务', title2: '特色服务', titleAdd: '新建特色服务', titleModify: '修改特色服务' },
  other: { title: '其他', title2: '其 他', titleAdd: '新建其他', titleModify: '修改其他' }
};

const Search = ({
  field,
  keyword,
  onSearch,
  onAdd,
  className
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'post_title', name: classMap[className].title }],
    selectProps: {
      defaultValue: 'post_title'
    },
    onSearch: (value) => {
      onSearch(value)
    }
  }

  return (
    <Row gutter={24}>
      <Col lg={8} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchGroup {...searchGroupProps} />
      </Col>
      <Col
        lg={{ offset: 8, span: 8 }}
        md={12}
        sm={8}
        xs={24}
        style={{ marginBottom: 16, textAlign: 'right' }}
      >
        <Button size="large" type="ghost" onClick={onAdd}>添加</Button>
      </Col>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string
}

const SearchForm = Form.create()(Search);

class modal extends React.PureComponent {

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible === true) {
      console.log(nextProps.item);
      if (_isEmpty(nextProps.item)) {
        this.props.form.resetFields();
        /*this.props.form.setFieldsValue({
          post_content: '<em>这里编写正文内容...</em>'
        })*/
      } else {
        this.props.form.setFieldsValue(nextProps.item);
      }
    }
  }

  handleOk() {
    const { item, onOk, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key
      }
      onOk(data)
    })
  }

  render() {
    const {
      visible,
      type,
      types,
      className,
      item = {},
      onCancel,
      form: {
        getFieldDecorator
      }
    } = this.props;
    const titleProps = classMap[className];
    const modalOpts = {
      title: `${type === 'create' ? titleProps.titleAdd : titleProps.titleModify}`,
      visible,
      onOk: ::this.handleOk,
      onCancel,
      // wrapClassName: 'vertical-center-modal',
      width: 'calc(100% - 275px)',
      style: { marginLeft: 255 }
    }

    const formItemLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 20,
        offset: 1
      }
    }

    return (
      <Modal {...modalOpts}>
        <Form>
          <FormItem label={titleProps.title2} hasFeedback {...formItemLayout}>
            {getFieldDecorator('post_title', {
              initialValue: item.post_title,
              rules: [
                {
                  required: true,
                  message: '标题未填写'
                }
              ]
            })(<Input />)}
          </FormItem>
          {
            className === 'article'
            ?
              <FormItem label="分 类：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('post_type', {
                  initialValue: item.post_type,
                  rules: [
                    {
                      required: true,
                      message: '分类未选择'
                    }
                  ]
                })(
                  <RadioGroup>
                    {
                      types.map((record) => {
                        return (
                          <RadioButton
                            key={record.type_id}
                            value={record.type_id}
                          >
                            {record.name}
                          </RadioButton>
                        );
                      })
                    }
                  </RadioGroup>
                )}
              </FormItem>
            :
              <noscript></noscript>
          }
          <FormItem label="简 介：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('post_excerpt', {
              initialValue: item.post_excerpt,
              rules: [
                {
                  required: true,
                  message: '简介未填写'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="内 容：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('post_content', {
              initialValue: item.post_content,
              rules: [
                {
                  required: true,
                  message: '内容未填写'
                }
              ]
            })(<RichEditor />)}
          </FormItem>
          <FormItem label="封 面：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('post_cover', {
              initialValue: item.post_cover
            })(<ChooseImg />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

modal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

const EditModal = Form.create()(modal);

const ContentList = (props) => {
  const {
    loading,
    dataSource,
    pagination,
    onPageChange,
    onDeleteItem,
    onEditItem,
    onChangeStatus,
    className
  } = props;
  const titleProps = classMap[className];
  const columns = [
    {
      title: '封面',
      dataIndex: 'post_cover',
      key: 'post_cover',
      width: 100,
      render: (fileId) => {
        if (fileId > 0) {
          return (
            <span
              className={styles.pic}
              style={{ backgroundImage: `url("api/contentImgs/getFile?id=${fileId}")` }}
            />);
        } else {
          return <span className={styles.pic} />
        }
      }
    }, {
      title: titleProps.title,
      dataIndex: 'post_title',
      key: 'post_title'
    }, {
      title: '创建时间',
      dataIndex: 'post_date',
      key: 'post_date'
    }, {
      title: '最后修改时间',
      dataIndex: 'post_modified',
      key: 'post_modified'
    }, {
      title: '发布',
      dataIndex: 'post_status',
      key: 'post_status',
      render: (text, record) => {
        const checkedUI = (() => {
          return (
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="cross" />}
              checked={text === 'publish'}
              onChange={(checked) => { onChangeStatus(record.ID, checked) }}
            />
          );
        })();
        return checkedUI;
      }
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <a onClick={() => onEditItem(record)} style={{ marginRight: 4 }}>编辑</a>
          <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.ID)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      )
    }
  ];
  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onChange={onPageChange}
      pagination={pagination}
      simple
      rowKey={record => record.ID}
    />
  );
};

ContentList.propTypes = {
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.any,
  pagination: PropTypes.any
}

function Contents({ dispatch, contents, location }) {
  const { loading, list, pagination, currentItem,
    modalVisible, modalType, types, className } = contents;
  const { field, keyword } = location.query || {};
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    types,
    visible: modalVisible,
    className,
    onOk(data) {
      dispatch({
        type: `contentManage/contents/${modalType}`,
        payload: data
      })
    },
    onCancel() {
      dispatch({
        type: 'contentManage/contents/hideModal'
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading,
    pagination,
    className,
    onPageChange(page) {
      const query = location.query;
      dispatch(routerRedux.push({
        pathname: '/contentManage/contents',
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({
        type: 'contentManage/contents/delete',
        payload: id
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'contentManage/contents/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    },
    onChangeStatus(id, checked) {
      dispatch({
        type: 'contentManage/contents/changeStatus',
        payload: {
          id,
          status: checked ? 'publish' : 'draft'
        }
      })
    }
  }

  const searchProps = {
    field,
    keyword,
    className,
    onSearch(fieldsValue) {
      !!fieldsValue.keyword.length ?
      dispatch(routerRedux.push({
        pathname: '/contentManage/contents',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      })) :
      dispatch(routerRedux.push({
        pathname: '/contentManage/contents'
      }));
    },
    onAdd() {
      dispatch({
        type: 'contentManage/contents/showModal',
        payload: {
          modalType: 'create'
        }
      })
    }
  }
  return (
    <div className="content-inner">
      <SearchForm {...searchProps} />
      <ContentList {...listProps} />
      <EditModal {...modalProps} />
    </div>
  )
}

Contents.propTypes = {
  contents: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    contents: state['contentManage/contents']
  };
}

export default connect(mapStateToProps)(Contents);
