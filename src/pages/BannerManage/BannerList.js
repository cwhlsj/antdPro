import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Card,
  Form,
  Input,
  Modal,
  Divider, message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BannerList.less';
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
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
    modalVisible:false,
  };


  componentWillMount() {
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
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  deleteConfirm=(admin)=> {
    // const formValues=this.state.formValues
    //
    // const { dispatch } = this.props;
    //
    // Modal.confirm({
    //   title: '确定删除该管理员？',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     admin={
    //       ...admin,
    //       status:0
    //     }
    //
    //     dispatch({
    //       type: 'admin/deleteAdmin',
    //       payload:{
    //         admin,
    //         formValues
    //       }
    //     });
    //
    //   },
    //
    // });

  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({
      formValues: params,
    });

    dispatch({
      type: 'admin/getQueryAdminData',
      payload: params,
    });
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
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteConfirm(record)}>清空</a>
        </Fragment>
      ),
    },
  ];


  render() {
    window.props=this.props
    const {
      banner: { data },
      loading,
    } = this.props;
    const { selectedRows,modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default BannerList;
