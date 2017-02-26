import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Row, Col,
         Table, Popconfirm, Tag,
         Input, Modal, Select } from 'antd'
import SearchGroup from '../components/ui/search';
import moment from 'moment'
import _isEmpty from 'lodash/isEmpty'

const FormItem = Form.Item
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const Search = ({
  field,
  keyword,
  onSearch
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'dest', name: '目的地' }],
    selectProps: {
      defaultValue: 'dest'
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
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string
}

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
      types,
      item = {},
      onCancel,
      form: {
        getFieldDecorator
      }
    } = this.props;
    const modalOpts = {
      title: `${type === 'create' ? '新建行程' : '修改行程'}`,
      visible,
      onOk: ::this.handleOk,
      onCancel,
      // wrapClassName: 'vertical-center-modal',
      width: 'calc(100% - 275px)',
      style: { marginLeft: 255 }
    }

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16,
        offset: 1
      }
    }

    return (
      <Modal {...modalOpts}>
        <Form>
          <Row>
            <Col span={10}>
              <FormItem label="目的地：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dest_name', {
                  initialValue: item.dest_name
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="客户名：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.dest_name
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem label="出行时间：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('travel_date', {
                  initialValue: moment(item.travel_date).format(dateFormat)
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="出行天数：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('travel_days', {
                  initialValue: item.travel_days
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem label="成人数：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('adult_no', {
                  initialValue: item.adult_no
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="儿童数：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('children_no', {
                  initialValue: item.children_no
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem label="手 机：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone_number', {
                  initialValue: item.phone_number
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="备 注：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('remarks', {
                  initialValue: item.remarks
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem label="订单状态：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('travel_status', {
                  initialValue: item.phone_number
                })(<Select>
                  <Option value="draft">待处理</Option>
                  <Option value="consulting">咨询中</Option>
                  <Option value="cancel">取消</Option>
                  <Option value="complete">完成</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
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

const SearchForm = Form.create()(Search);

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
      title: '目的地',
      dataIndex: 'dest_name',
      key: 'dest_name',
      render: (text = 'x') => {
        return [
          <Tag key="tag" color="blue-inverse">{text[0]}</Tag>,
          <span key="text">{text}</span>
        ]
      }
    }, {
      title: '客户名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '出行时间',
      dataIndex: 'travel_date',
      key: 'travel_date',
      render: (text) => {
        return moment(text).format(dateFormat);
      }
    }, {
      title: '出行天数',
      dataIndex: 'travel_days',
      key: 'travel_days'
    }, {
      title: '成人数',
      dataIndex: 'adult_no',
      key: 'adult_no'
    }, {
      title: '儿童数',
      dataIndex: 'children_no',
      key: 'children_no'
    }, {
      title: '手机',
      dataIndex: 'phone_number',
      key: 'phone_number'
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    }, {
      title: '创建时间',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (text) => {
        return moment(text).format(dateFormat);
      }
    }, {
      title: '最后修改时间',
      dataIndex: 'last_modified',
      key: 'last_modified',
      render: (text) => {
        return moment(text).format(dateFormat);
      }
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <p>
          <a onClick={() => onEditItem(record)} style={{ marginRight: 4 }}>编辑</a>
          <Popconfirm title="确定要删除旅行计划吗？！" onConfirm={() => onDeleteItem(record.ID)}>
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
      scroll={{ x: 1200 }}
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

function Travel({ dispatch, travel, location }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, types } = travel;
  const { field, keyword } = location.query || {};
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    types,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `travel/${modalType}`,
        payload: data
      })
    },
    onCancel() {
      dispatch({
        type: 'travel/hideModal'
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
        pathname: '/travel',
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({
        type: 'travel/delete',
        payload: id
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'travel/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    },
    onChangeStatus(id, checked) {
      dispatch({
        type: 'travel/changeStatus',
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
    onSearch(fieldsValue) {
      !!fieldsValue.keyword.length ?
      dispatch(routerRedux.push({
        pathname: '/travel',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      })) :
      dispatch(routerRedux.push({
        pathname: '/travel'
      }));
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

Travel.propTypes = {
  travel: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    travel: state.travel
  };
}

export default connect(mapStateToProps)(Travel);
