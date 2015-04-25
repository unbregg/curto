## 约定说明文档
>**声明：该说明文档详细说明了系统提供的基础功能模块，前端与后端REST请求规范，前端与后端数据通信格式标准，以及前端和后端统一查询参数，基于Ember-Data的扩展等等功能，随着技术功能的增长以及变化，该文档会随之发生改变**
***
>开发声明：约定了前后端的数据、REST、查询参数等约定，需要后端实现对应技术要点
>数据通讯说明：该文档所描述的数据通讯非标准规范定义，如果需要实现OASIS所规定的[OData](www.odata.org)标准，可以参考详细`OData`说明

#### 目录结构
```
app
├── adapters
├── authenticators
├── authorizers
├── components
├── controllers
│   ├── popups
│   │   ├── list.js
│   │   ├── confirm.js
│   │   ├── tree.js
│   │   └── other popup...
│   └── login.js
├── helpers
├── initializers
│   ├── model-mount.js
│   ├── reopen.js
│   ├── error-handler.js
│   ├── init-locale.js
│   ├── preload-data.js
│   ├── reopen.js
│   └── authentication.js
├── locales
│   ├── cn.js
│   ├── en.js
│   └── other language...
├── mixins
│   ├── build-url.js
│   ├── route.js
│   └── other mixins...
├── model-configs？
│   ├── sys-user.js
│   ├── sys-role.js
│   └── other model config...
├── models
│   ├── sys-user.js
│   ├── sys-role.js
│   └── other models...
├── routemetas
│   ├── platform.js
│   ├── flow.js
│   └── other route meta...
├──services
├── routes
│   ├── application.js
│   ├── dashboard.js
│   ├── login.js
│   └── other route...
├── styles
│   └── app.css
├── templates
│   ├── components
│   ├── member-permissions
│   │   ├── list.hbs
│   │   ├── confirm.hbs
│   │   └── tree.hbs
│   ├── application.hbs
│   └── other route...
├── utils
│   ├── bulkers.js
│   ├── ember-data-common.js？
│   ├── ember-data-finders.js？
│   ├── serializer-support.js？
│   └── other validator...
├── serializers？
├── views
├── validators
│   ├── remote.js
│   ├── uniqueness.js
│   ├── condition-presence.js
│   └── other validator...
├── app.js
├── store.js
├── index.js
└── router.js
```
#### 目录结构细节说明
- 目录除了包含ember-cli所定义的基本目录结构，扩展了`authenticators` `authorizers` `locales` `routemetas` `model-configs` `validators` `model-configs` `services`等目录，后续可以根据功能扩展进行调整，另，可以将所有配置相关信息合到同一个目录，现有是分开
- 各个目录已经列明的脚本文件是目前所明确的功能点，以及具备基本的代码实现
- 问号结尾的文件或文件夹需要进行详细设计和讨论，梳理出针对各个实现点的机制

***

### 要点说明

#### Rest规范说明
#### 资源
| 资源      |    URI | 操作  | 说明  |条件|
| :-------- | --------:| :--: | --------:|  --------:| 
| User  | example.com/users/ |  GET   | 获取全部用户   |
| User     |   example.com/users?filter |  GET  |根据过滤条件获取用户|filter limit offset|
| User      |    example.com/users/ | POST  |新建用户|请求体包含资源属性|
#### 资源上的操作
| 资源      |    URI | 操作  | 说明  |条件|
| :-------- | --------:| :--: | --------:|  --------:| 
| User  | example.com/users/findOne |  GET   | 根据过滤条件返回第一个满足条件的资源   |
| User     |   example.com/users/login |  POST  |根据请求体信息进行登录操作|该接口需要的相关请求体信息|
| User      |    example.com/users/logout | POST  |执行登出操作|该接口需要的相关请求体信息|
#### 对象
| 资源      |    URI | 操作  | 说明  |
| :-------- | --------:| :--: | --------:|  --------:| 
| User  |example.com/users/{id} |  GET   | 查找指定ID用户 |
| User  |example.com/users/{id} |  PUT | 更新指定ID用户|
| User  |example.com/users/{id} | DELETE  |删除指定ID用户|
#### 对象上的操作
| 资源      |    URI | 操作  | 说明  |
| :-------- | --------:| :--: | --------:|  --------:| 
| User  |example.com/users/{id}/exists |  GET   | 查看某个用户是否存在 |
| User  |example.com/orgs/{id}/children |  GET |异步某个节点下的子节点，类似于异步查找树|
| User  |example.com/orgs/{id}/findTree | GET  |异步某个节点下的树|
#### 批量
| 资源      |    URI | 操作  | 说明  |
| :-------- | --------:| :--: | --------:|  --------:| 
| User  |example.com/users?ids=[1,2,3] |  DELETE   | 根据IDS批量删除资源 |
| User     |   example.com/users/bulkUpdate |  PUT   |批量更新资源|
| User      |    example.com/users/bulkCreate | POST  |批量新建资源|
#### 关联关系
>**说明：目前没有定义关联关系的REST相关标准，但是默认约定资源个数不能超过两个，即`/users/{id}/accessTokens/{id}`**

#### Ember-Data扩展说明
##### 支持资源和对象上的操作
- 扩展URL创建，支持资源和对象上的操作
```javascript
//请以最新版ember-data为准，如果后续该实现发生重大改变，这里实现也要对应更新
buildURL(type, id, snapshot, requestType, operation) {
    switch (requestType) {
      case 'find':
        return this.urlForFind(id, type, snapshot);
      ...
      case 'resourceOperation':
        return this.urlForResourceOperation(type, operation);
      case 'recordOperation':
        return this.urlForRecordOperation(id, type, snapshot, operation);
      default:
        return this._buildURL(type, id);
    }
  },
/**
   *
   * @param type
   * @param operation
   * @returns {string}
   */
  urlForResourceOperation: function (type, operation) {
    return this._buildURL(type) + '/' + operation;
  },
  /**
   *
   * @param id
   * @param type
   * @param snapshot
   * @param operation
   * @returns {string}
   */
  urlForRecordOperation: function (id, type, snapshot, operation) {
    return this._buildURL(type, id) + '/' + operation;
  },
```
##### Many-To-Many(through)
> Todo

- 支持多对多的关联关系的增删该查
```javascript
App.Patient = DS.Model.extend({
    physicals:hasMany('physical',{through:'appointment'})
});
App.Physical = DS.Model.extend({
    patients:hasMany('patient',{through:'appointment'})
});
```
##### Many-To-Many With PrincipalType
> Todo

##### 模型元数据信息(Metadata)扩展
> Todo

- 扩展便于获取metadata储存信息的接口
- 根据约定，metadata可存储的基础信息包括`page` `success` `error`，
- 讨论和设计metadata可能的使用场景，待定？
```js
metadata:{
   page:{
       limit:10,
       offset:0,
       total:1000
   },
   success:{
       message:'something tips',
       code:10020,
       moreIfo:'http://example.com/errors/10020'
   }
}
```
##### One-To-Many Find With Pagination
> Todo

- 默认的实现不能支持分页获取一对多数据
##### Pagination With Filter
> Todo

#### 路由视图状态保存
> Todo

#### 组件
##### 模态框
- 统一的调用方式
- 感知触发源的存在，并且能够与触发源相处通讯
- 无限层级模态框
```html
list 要调用的模态框
modelType 为传进去到模态框的参数，可以有多个参数
 <button {{action 'openPopup' 'list' modelType}} />
```
```js
参数说明同上
 this.send('openPopup', popupName, selection);
```
##### Notification
> Todo

##### Grid
> Todo

##### Tree
> Todo

##### RichDropDown
> Todo

#### Filter统一查询参数
##### limit
```js
{
   filter:{
      limit:10
   }
}
```
##### offset
```js
{
   filter:{
      offset:0
   }
}
```
##### order
```js
{
   filter:{
      order:['id ASC','name desc']
   }
}
```
##### fields
```js
{
   filter:{
      fields:['id','name','age']
   }
}
```
##### where
```js
{
   filter:{
      where:{
          name:{
               like:'%jack%'
          },
          and:[{
              age:30
          },{
              address:{
                  like:'%Xiamen%'
              }
          }]
      }
   }
}
```
###### Operator
- like
- unlike
- gt
- gte
- lt
- lte
- between
- inq
- nin

#### 基础增删改查Blueprint
> Todo

#### 异常处理
> Todo

#### 国际化
> Todo 待讨论和设计

- 按照模块进行拆分，与路由设计约定一致
```js
var locale = {
 //locale path
};
```
#### 路由设计
> Todo 待讨论和设计

- 按照模块进行设计，与路由设计约定一致
```js
var config = {
  icon: 'fa-laptop',
  template: 'platform',
  authCode: 'platform',
  group: 'sidebar',
  children: []
};
```
#### 系统功能模块
##### 登录
- 实现登录所需要的鉴定器
- 基本的登录模块相关API
```js
ApplicationAdapter.extend({
  /**
   * Login a user with username/email and password
   * @param {DS.Store} store
   * @param {subclass of DS.Model} type
   * @param credentials {Object}
   * @param include {String} only valid value is 'user',others will be ignored.
   * @returns {Promise}
   */
  login: function (store, type, credentials, include) {
    return this.ajax(this.appendURL(type.typeKey, "login/"), "POST", {data: credentials});
  },
  /**
   * Logout a user with access token
   * @param {DS.Store} store
   * @param {subclass of DS.Model} type
   * @param tokenId {String}
   * @returns {Promise}
   */
  logout: function (store, type, tokenId) {
    return this.ajax(this.appendURL(type.typeKey, "logout"), "POST", {data: {access_token: tokenId}});
  }
});
```
```js
actions: {
    login: function () {
      var self = this;
      self.set('isAuthenticating',true);
      this.validate().then(function(){
        //TODO stop use private property ：_actions
        return self._actions['authenticate'].apply(self).catch(function(reason){
          self.errors.clear();
          self.errors.pushObject(reason.error.message);
        });
      }).finally(function(){
        self.set('isAuthenticating',false);
      });
    }
  }
```
##### 权限
> Todo

##### 平台管理
> Todo
