import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Button, Row, Col,
         Table, Popconfirm,
         Input, Modal } from 'antd'
import SearchGroup from '../../components/ui/search'
import _isEmpty from 'lodash/isEmpty'

const FormItem = Form.Item

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
    selectOptions: [{ value: 'name', name: '名称' }, { value: 'summary', name: '描述' }],
    selectProps: {
      defaultValue: 'name'
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
      item = {},
      onCancel,
      form: {
        getFieldDecorator
      }
    } = this.props;
    const modalOpts = {
      title: `${type === 'create' ? '新建文章分类' : '修改文章分类'}`,
      visible,
      onOk: ::this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal'
    }

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    return (
      <Modal {...modalOpts}>
        <Form>
          <FormItem label="名称：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: '名称未填写'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="描述：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('summary', {
              initialValue: item.summary,
              rules: [
                {
                  required: true,
                  message: '描述未填写'
                }
              ]
            })(<Input type="textarea" />)}
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
      title: '类型名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '描述',
      dataIndex: 'summary',
      key: 'summary'
    }, {
      title: '',
      dataIndex: 'nickName',
      key: 'nickName'
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <a onClick={() => onEditItem(record)} style={{ marginRight: 4 }}>编辑</a>
          <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.type_id)}>
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
      rowKey={record => record.type_id}
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
  const { loading, list, pagination, currentItem, modalVisible, modalType } = contentTypes;
  const { field, keyword } = location.query || {};
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `contentManage/contentTypes/${modalType}`,
        payload: data
      })
    },
    onCancel() {
      dispatch({
        type: 'contentManage/contentTypes/hideModal'
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
        pathname: '/contentManage/contentTypes',
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({
        type: 'contentManage/contentTypes/delete',
        payload: id
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'contentManage/contentTypes/showModal',
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
        pathname: '/contentManage/contentTypes',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      })) :
      dispatch(routerRedux.push({
        pathname: '/contentManage/contentTypes'
      }));
    },
    onAdd() {
      dispatch({
        type: 'contentManage/contentTypes/showModal',
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
    contentTypes: state['contentManage/contentTypes']
  };
}

export default connect(mapStateToProps)(ContentTypes);
