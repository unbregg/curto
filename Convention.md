# 约定说明文档

@[Ember|Ember-CLI|Ember-Addons]

-----

[TOC]

-----


###项目环境搭建

> **Ember-CLI** 是一款Ember命令行工具，基于 **Broccoli**的构建工具，内建了项目代码结构规范，提供了快速的资源编译功能。

####Ember-CLI安装


- 安装`Node.js`
	对于Nodejs的版本选择可以有 [NODE.JS](https://nodejs.org/) | [IO.JS](https://iojs.org/en/index.html),可以选择其中一个的最新版本进行安装即可.

- 安装`git`
	Ember-CLI中使用[Bower](http://bower.io/)作为前端资源管理，Bower在某些场景下可能会使用git载入`github`的资源 [git安装指南](http://jingyan.baidu.com/article/bea41d4373e9bdb4c41be669.html)

- 安装`Bower`,在命令行窗口中敲入 `npm install -g bower`进行Bower包的安装

- 安装`Ember-CLI`，在命令行窗口中敲入`npm install -g ember-cli`进行Ember-cli构建工具安装

安装完以上的依赖后，Ember-CLI构建工具就已就绪，即可开始前端项目构建

**[Ember-CLI详细使用指南](http://www.ember-cli.com/)**



>**声明：该说明文档详细说明了系统提供的基础功能模块，前端与后端REST请求规范，前端与后端数据通信格式标准，以及前端和后端统一查询参数，基于Ember-Data的扩展等等功能，随着技术功能的增长以及变化，该文档会随之发生改变**
***
>开发声明：约定了前后端的数据、REST、查询参数等约定，需要后端实现对应技术要点
>数据通讯说明：该文档所描述的数据通讯非标准规范定义，如果需要实现OASIS所规定的[OData](https://www.odata.org)标准，可以参考详细`OData`说明

#### 目录结构(详见[Folrder-Layout](http://www.ember-cli.com/#folder-layout))
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
├── services?
├── routes
│   ├── application.js
│   ├── dashboard.js
│   ├── login.js
│   └── other route...
├── styles
│   └── app.css
├── templates
│   ├── components
│   ├── popups
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

- 支持多对多的关联关系的增删改查
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
       moreInfo:'http://example.com/errors/10020'
   }
}
```
##### One-To-Many Find With Pagination
> Todo

- 默认的实现不能支持分页获取一对多数据

##### Pagination With Filter
> Todo

#### 异常处理
> 项目目前提供了对于Ajax异常的全局捕捉处理，对于进入路由时发生的HTTP异常，将在错误展示页面中显示异常信息(本机制由Ember负责，不冒泡至全局异常处理)
>
> 对于在交互期间引起的异常，如果代码未进行异常捕获，已经冒泡至全局异常管理器后，视窗右下角将弹出错误提示 （使用`Messenger`组件）

```js
	//<button {{action "save"}}>saveUser</button>
	
	//..Some Controller
	
	actions:{
		save:function(user){
			//对于未catch的情况，如果请求失败，将统一冒泡至全局统一异常处理器处理
			user.save();
			//如果异常已由代码手动捕获，那么异常将不会冒泡至全局统一异常处理器
			user.save().catch(function(e){
				//do something you want
			});
			//如果异常已由代码手动捕获后，还希望全局异常处理器处理该异常，则继续将异常抛出即可
			user.save().catch(function(e){
				//do something you want
				throw e;
			});

		}
	}	

```


#### 路由视图状态保存
> Todo

- 优先考虑增强路由具备挂起和恢复功能，从视图角度入手暂时非优先考虑
#### 组件
##### 模态框
- 统一的调用方式
- 感知触发源的存在，并且能够与触发源相互通讯
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
> 项目采用`Messenger`作为消息提示组件，并拓展出`info`,`error`,`success`接口，使用方式为
```js
	//视窗右下角将弹出窗口显示对应的信息
	Messenger.info(msg)
	Messenger.error(msg)
	Messenger.success(msg)	
``` 

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

#### 国际化
> Todo 待讨论和设计

- 按照模块进行拆分，与路由设计约定一致
```js
var locale = {
 //locale path
};
```

#### ES6语法规范
Ember-CLI 内置Babel作为ES6-ES5的语法解析器，目前建议使用的语法包括

```js
//箭头符
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);

// Statement bodies
nums.forEach(v => {
  if (v % 5 === 0)
    fives.push(v);
});

//字符模板
var a='hello'
//注意，这不是单引号，这是esc下面的那个键。
console.log(`${a} world`); => 'hello world'

//默认值、REST
function f(x, y=12) {
  // y is 12 if not passed (or passed as undefined)
  return x + y;
}
f(3) == 15

function f(x, ...y) {
  // y is an Array
  return x * y.length;
}
f(3, "hello", true) == 6

function f(x, y, z) {
  return x + y + z;
}
// Pass each elem of array as argument
f(...[1,2,3]) == 6

//常见场景如
export defualt Ember.ObjectController.extend({
	init:function(){
		this._super.apply(this,arguments);
	}
	//等价于
	init(){
		this._super(...arguments);
	}
})

//LET|CONST

function f() {
  {
    let x;
    {
      // okay, block scoped name
      const x = "sneaky";
      // error, const
      x = "foo";
    }
    // error, already declared in block
    let x = "inner";
  }
}

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
