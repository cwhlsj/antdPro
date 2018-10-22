import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('F:/react/antdPro/my-project/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('F:/react/antdPro/my-project/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('F:/react/antdPro/my-project/src/models/login.js').default) });
app.model({ namespace: 'newPage', ...(require('F:/react/antdPro/my-project/src/models/newPage.js').default) });
app.model({ namespace: 'project', ...(require('F:/react/antdPro/my-project/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('F:/react/antdPro/my-project/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('F:/react/antdPro/my-project/src/models/user.js').default) });
app.model({ namespace: 'register', ...(require('F:/react/antdPro/my-project/src/pages/User/models/register.js').default) });
app.model({ namespace: 'admin', ...(require('F:/react/antdPro/my-project/src/pages/AdminManage/models/admin.js').default) });
app.model({ namespace: 'banner', ...(require('F:/react/antdPro/my-project/src/pages/BannerManage/models/banner.js').default) });
app.model({ namespace: 'activities', ...(require('F:/react/antdPro/my-project/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('F:/react/antdPro/my-project/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('F:/react/antdPro/my-project/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'form', ...(require('F:/react/antdPro/my-project/src/pages/Forms/models/form.js').default) });
app.model({ namespace: 'rule', ...(require('F:/react/antdPro/my-project/src/pages/List/models/rule.js').default) });
app.model({ namespace: 'profile', ...(require('F:/react/antdPro/my-project/src/pages/Profile/models/profile.js').default) });
app.model({ namespace: 'error', ...(require('F:/react/antdPro/my-project/src/pages/Exception/models/error.js').default) });
app.model({ namespace: 'geographic', ...(require('F:/react/antdPro/my-project/src/pages/Account/Settings/models/geographic.js').default) });
