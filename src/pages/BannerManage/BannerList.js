import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Switch,
  Table,
  Card,
  Form,
  Input,
  Modal,
  Divider, message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BannerList.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const EditBannerForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, record } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
        form.resetFields();
      handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑banner"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: record.id,
      })(<Input hidden/>)}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片路径">
        {form.getFieldDecorator('imagePath', {
          initialValue: record.imagePath,
          rules: [{ required: true, message: '请输入图片路径！' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="链接地址">
        {form.getFieldDecorator('link', {
          initialValue: record.link,
          rules: [{ required: true, message: '请输入链接地址！' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前端显示:">
        {form.getFieldDecorator('display', {
          initialValue: record.display === 1,
          rules: [{ required: true }],
        })(<Switch checkedChildren="显示" unCheckedChildren="不显示"  defaultChecked={record.display === 1}/>)}

      </FormItem>
    </Modal>
  );
});

@connect(({ banner, loading }) => ({
  banner,
  loading: loading.models.banner,
}))
@Form.create()
class BannerList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    record: {},
  };


  columns = [
    {
      title: '图片路径',
      dataIndex: 'imagePath',
    },
    {
      title: '链接地址',
      dataIndex: 'link',
    },
    {
      title: '是否在前台显示',
      dataIndex: 'display',
      render:val=>`${val===1? '是':'否'}`
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.setState({ record: record }, () => {
            this.handleModalVisible(true);
          })}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.deleteConfirm(record)}>清空</a>
        </Fragment>
      ),
    },
  ];


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/getAllBanner',
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleEdit = fields => {
    const { dispatch } = this.props;
    const banner={
      ...fields,
      display:fields.display===true? 1:0
    }
    dispatch({
      type: 'banner/edit',
      payload: banner
    });
    message.success('编辑成功');
    this.handleModalVisible();
  };

  deleteConfirm = (banner) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定清空该项？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const param={
          ...banner,
          imagePath:'——',
          link:'——',
          display: 0
        }

        dispatch({
          type: 'banner/edit',
          payload:param
        });

      },

    });

  };


  render() {
    window.props = this.props;
    const {
      banner: { data },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,

    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              dataSource={data}
              columns={this.columns}
              pagination={false}
            />
          </div>
        </Card>
        <EditBannerForm {...parentMethods} modalVisible={modalVisible} display={this.state.display}
                        record={this.state.record}/>
      </PageHeaderWrapper>
    );
  }
}

export default BannerList;
