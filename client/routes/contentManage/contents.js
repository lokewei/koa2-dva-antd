import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Button, Row, Col,
         Table, Popconfirm,
         Input, Modal, Radio } from 'antd'
import SearchGroup from '../../components/ui/search'
import styles from './contents.less'
import RichEditor from '../../components/RichEditor'
import _isEmpty from 'lodash/isEmpty'

const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Search = ({
  field,
  keyword,
  onSearch,
  onAdd
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'post_title', name: '标题' }],
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
      if (_isEmpty(nextProps.item)) {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({
          post_content: '<em>这里编写正文内容...</em>'
        })
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
      item = {},
      onCancel,
      form: {
        getFieldDecorator
      }
    } = this.props;
    const modalOpts = {
      title: `${type === 'create' ? '新建文章' : '修改文章'}`,
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
          <FormItem label="标 题：" hasFeedback {...formItemLayout}>
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
                  message: '标题未填写'
                }
              ]
            })(<RichEditor />)}
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
    onEditItem
  } = props;
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
      title: '标题',
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

function ContentTypes({ dispatch, contentTypes, location }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, types } = contentTypes;
  const { field, keyword } = location.query || {};
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    types,
    visible: modalVisible,
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
    }
  }

  const searchProps = {
    field,
    keyword,
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

ContentTypes.propTypes = {
  contentTypes: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    contentTypes: state['contentManage/contents']
  };
}

export default connect(mapStateToProps)(ContentTypes);
