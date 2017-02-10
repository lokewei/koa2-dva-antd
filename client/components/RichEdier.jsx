import React, { PropTypes } from 'react'
import TinyMCE from 'react-tinymce'

class RichEditer extends React.Component {

  onChange() {
    console.log(111);
  }

  render() {
    return (<TinyMCE
      content="<p>这里插入文章内容</p>"
      config={{
        plugins: 'link image code',
        language: 'zh_CN',
        min_height: 400
      }}
    />);
  }
}

RichEditer.defaultProps = {
  value: ''
}

RichEditer.propTypes = {
  content: PropTypes.string
}

export default RichEditer;
