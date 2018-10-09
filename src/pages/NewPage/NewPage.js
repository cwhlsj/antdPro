
import React from 'react';
import { Button, notification, Card } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from 'dva';


@connect(({ newPage, loading }) => ({
  newPage,
  submitting: loading.effects['newPage/hahaha'],
}))

export default class NewPage extends React.Component {
  state = {
    value: 'test',
  };


  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'newPage/hahaha',
      // payload: values.mobile,
    })
  }

  handleChange = (value) => {
    this.setState({
      value,
    })
  };

  prompt = () => {
    notification.open({
      message: 'We got value:',
      description: <span dangerouslySetInnerHTML={{ __html: this.state.value }}></span>,
    });
  };

  render() {
    let props = this.props;
    window.props=props;
    return (
      <Card title="富文本编辑器">
        <ReactQuill value={this.state.value} onChange={this.handleChange} />
        <Button style={{ marginTop: 16 }} onClick={this.prompt}>Prompt</Button>
      </Card>
    );
  }
}
