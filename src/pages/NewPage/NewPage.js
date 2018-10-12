
import React from 'react';
import { Button, notification, Card , Upload, message, Icon} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from 'dva';
import router from 'umi/router';



const ttt = {
  name: 'file',
  action: '/server/upload/file',
  multiple:true,
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};


@connect(({ newPage, loading }) => ({
  newPage,
  submitting: loading.effects['newPage/hahaha'],
}))

 class NewPage extends React.Component {
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

  goUser=()=>{
    router.push('/user')
  }


  render() {
    const props = this.props;
    window.props=props;
    return (
      <div>
        <Card title="富文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange} />
          <Button style={{ marginTop: 16 }} onClick={this.prompt}>Prompt</Button>
        </Card>


        <Button onClick={this.goUser}>页面跳转</Button>


        <Upload {...ttt}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>


    );
  }
}
export default NewPage
