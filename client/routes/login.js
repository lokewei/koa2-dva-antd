import React, { PropTypes } from 'react'
import { Button, Row, Form, Input } from 'antd'
import { config } from '../utils'
import styles from './login.less'
import Message from '../components/message'

const FormItem = Form.Item

const login = ({
  loginButtonLoading,
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll
  },
  submitResult: {
    type,
    message
  }
}) => {
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      onOk(values)
    })
  }

  return (
    <div className={styles.form}>
      <Message type={type} message={message} />
      <div className={styles.logo}>
        <img src={config.logoSrc} alt="logo" />
        <span>泰旅目的地后台</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请填写用户名'
              }
            ]
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请填写密码'
              }
            ]
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginButtonLoading}>
            登录
          </Button>
        </Row>
        {/*<p>
          <span>账号：guest</span>
          <span>密码：guest</span>
        </p>*/}
      </form>
    </div>
  )
}

login.propTypes = {
  form: PropTypes.object,
  loginButtonLoading: PropTypes.bool,
  onOk: PropTypes.func,
  submitResult: PropTypes.object
}

export default Form.create()(login)
