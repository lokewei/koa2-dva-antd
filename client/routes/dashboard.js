import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import NumberCard from '../components/dashboard/numberCard'
import Quote from '../components/dashboard/quote'
import Sales from '../components/dashboard/sales'
import Weather from '../components/dashboard/weather'
import styles from './dashboard.less'
import { color } from '../utils'

function Dashboard({ dashboard /* , dispatch*/ }) {
  const {
    weather,
    sales,
    quote,
    numbers
  } = dashboard;
  const numberCards = numbers.map((item, key) => <Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>)

  return (
    <Row gutter={24}>
      <p style={{ color: 'red' }}>演示用，非真实数据!</p>
      {numberCards}
      <Col lg={18} md={24}>
        <Card bordered={false} bodyStyle={{ padding: '24px 36px 24px 0' }}>
          <Sales data={sales} />
        </Card>
      </Col>
      <Col lg={6} md={24}>
        <Row gutter={24}>
          <Col lg={24} md={12}>
            <Card
              bordered={false}
              className={styles.weather}
              bodyStyle={{ padding: 0, height: 204, background: color.blue }}
            >
              <Weather {...weather} />
            </Card>
          </Col>
          <Col lg={24} md={12}>
            <Card
              bordered={false}
              className={styles.quote}
              bodyStyle={{ padding: 0, height: 204, background: color.peach }}
            >
              <Quote {...quote} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

Dashboard.propTypes = {
  weather: PropTypes.object,
  sales: PropTypes.array,
  quote: PropTypes.object,
  numbers: PropTypes.array
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
