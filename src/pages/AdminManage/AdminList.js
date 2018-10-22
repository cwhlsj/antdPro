import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  InputNumber,
  DatePicker,
  Modal,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './AdminList.less';
import Link from 'umi/link';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker=DatePicker.RangePicker
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ admin, loading }) => ({
  admin,
  loading: loading.models.admin,
}))
@Form.create()
class AdminList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '用户',
      dataIndex: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },

    {
      title: '创建日期',
      dataIndex: 'ctime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '权限',
      dataIndex: 'authority',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link to={'/admin/addAdmin?editId='+record.id}>编辑</Link>
          <Divider type="vertical" />
          <a onClick={() => this.deleteConfirm(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  deleteConfirm=(admin)=> {
    const formValues=this.state.formValues

    const { dispatch } = this.props;

    Modal.confirm({
      title: '确定删除该管理员？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        admin={
          ...admin,
          status:0
        }

        dispatch({
          type: 'admin/deleteAdmin',
          payload:{
            admin,
            formValues
          }
        });

      },

    });

  }
  componentDidMount() {
    const { dispatch,admin } = this.props;
    const pagination={
      pageSize: admin.data.pagination.pageSize,
      currentPage: 1
    }
    dispatch({
      type: 'admin/getQueryAdminData',
      payload: pagination,
    });
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

  handleFormReset = () => {
    const { form, dispatch,admin } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    const pagination={
      pageSize: admin.data.pagination.pageSize,
      currentPage: 1
    }
    dispatch({
      type: 'admin/getQueryAdminData',
      payload: pagination,
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form ,admin} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const ctimeValue = fieldsValue['ctimeList'];
      // const currentPag=admin.data.pagination.current
      const pageSize=admin.data.pagination.pageSize

      debugger
      const values = {
        ...fieldsValue,
        startDate:ctimeValue.length!==0? ctimeValue[0].format('YYYY-MM-DD'):undefined,
        endDate:ctimeValue.length!==0?ctimeValue[1].format('YYYY-MM-DD'):undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        ctimeList:undefined,
        // currentPage:currentPag,
        pageSize:pageSize,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'admin/getQueryAdminData',
        payload: values,
      });
    });
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户账号">
              {getFieldDecorator('account')(<Input placeholder="请输入用户账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入用户姓名" style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户账号">
              {getFieldDecorator('account')(<Input placeholder="请输入账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入姓名" style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('phone')(<InputNumber style={{ width: '100%' }} placeholder='输入手机号码'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('ctimeList',
                {rules: [{ type: 'array'}]})
              (
                <RangePicker  style={{ width: '100%' }}  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电子邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入邮箱号" style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户权限">
              {getFieldDecorator('authority')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="user">user</Option>
                  <Option value="admin">admin</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    window.props=this.props
    const {
      admin: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
