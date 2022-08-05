import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message,
  Container, Aside, Main, Header, Menu, Submenu,
  MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem,
  Card, Row, Col, Table, TableColumn, Switch, Tooltip
  , Pagination, Dialog, MessageBox, Tag, Tree, Select, Option,
  Cascader, Alert,Tabs,TabPane
 } from 'element-ui'

// 导入弹框提示

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.prototype.$message = Message   //这样挂载原型上 直接使用this.$message
Vue.prototype.$confirm = MessageBox.confirm  //这样挂载原型上 直接使用this.$confirm


