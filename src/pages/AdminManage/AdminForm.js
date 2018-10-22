import React, { PureComponent } from 'react';
import { connect } from 'dva';
import request from '@/utils/request';
import { getQueryParam } from '@/utils/utils';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Radio,
  message
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@connect(({ admin,loading }) => ({
  admin,
  submitting: loading.effects['admin/addOrUpdateAdmin'],
  formData:admin.adminProps
}))
@Form.create()
class AdminForm extends PureComponent {

  state = {
    confirmDirty: false,
    visible: false,
    help: '',

  };

  componentWillMount(){
    const id = getQueryParam('editId');
    //编辑页加载数据
    if(id){
      const { dispatch } = this.props;
      dispatch({
        type: 'admin/getAdminById',
        payload: {
          id:id,
        },
      });
    }
  }
  //离开页面初始化adminProps
  componentWillUnmount(){
    const id = getQueryParam('editId');

      const { dispatch } = this.props;
      dispatch({
        type: 'admin/updateAdminProps',
        payload: {
          id:undefined,
          name: undefined,
          password: undefined,
          account: undefined,
          phone: undefined,
          email: undefined,
          description: undefined,
          authority: undefined,
        },
      });
  }

  handleSubmit = e => {
    const id=getQueryParam('editId');
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //编辑页form表单有id
        if(id){
          values={
            ...values,
            id:id,
            status:1
          }
        }
        dispatch({
          type: 'admin/addOrUpdateAdmin',
          admin: values,
        });


      }
    });

  };


  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkAdminAccount = (rule, value, callback) => {
    const { formData ,form} = this.props;
    request('/server/admin/checkAdminCount?account='+value).then(
      response=>{
        if(response){
            if (response.code===1){
              //数据库存在账户并且与编辑页当前账户不同就给出提示账号已存在
              if(response.data===1&& formData.account!==form.getFieldValue('account') )
                callback('该账号已存在！')
              else callback();
            }
            else {
              message.error(response.data.message)
            }
        }
        }
      );


    };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback();
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('密码长度不能小于6');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };



  render() {
    window.props=this.props
    const { submitting,formData } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={getQueryParam('editId')? '编辑管理员':"新增管理员"}
        content="最高权限admin管理员可分配普通管理员user账号，该页面普通管理员不可见。"
      >
        <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="账号名称">
              {getFieldDecorator('account', {
                initialValue:formData.account ,
                rules: [
                  {
                    required: true,
                    message: '请输入账号',
                  },
                  {
                    validator: this.checkAdminAccount,
                  },
                ],
              })(<Input placeholder="请输入账号"  />)}
            </FormItem>

            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                initialValue:formData.password,
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input type='password' placeholder="请输入密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirm', {
                initialValue:formData.password ,
                rules: [
                  {
                    required: true,
                    message: '请再次输入密码',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input type='password' placeholder="请再次输入密码确认" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户姓名">
              {getFieldDecorator('name', {
                initialValue:formData.name ,
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },

                ],
              })(<Input placeholder="请输入账号"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('phone', {
                initialValue:formData.phone ,
                rules: [
                  {
                    required: true,
                    message: '请输入使用该账号人的手机号码',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误！',
                  },
                ],
              })(<Input placeholder="请输入使用该账号人的手机号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="电子邮箱">
              {getFieldDecorator('email', {
                initialValue:formData.email ,
                rules: [
                  {
                    required: true,
                    message: '请输入使用该账号人的电子邮箱',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误！',
                  },
                ],
              })(<Input type='email' placeholder="请输入使用该账号人的电子邮箱" />)}
            </FormItem>


            <FormItem {...formItemLayout} label="该账号职责描述">
              {getFieldDecorator('description', {
                initialValue:formData.description ,
                rules: [
                  {
                    required: true,
                    message: '请输入目标描述',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入工作描述"
                  rows={4}
                />
              )}
            </FormItem>



            <FormItem {...formItemLayout} label="权限">

              {getFieldDecorator('authority', {
                initialValue:formData.authority ,
                rules: [
                  {
                    required: true,
                    message: '请选择权限',
                  },
                ],
              })(
                <RadioGroup  >
                  <Radio value='user' defaultChecked  >user</Radio>
                  <Radio value='admin'>admin</Radio>
                </RadioGroup>
              )}

            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>

            </FormItem>
          </Form>
        </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default AdminForm;
