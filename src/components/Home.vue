<template>
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header> 
        <div>
          <img src="../assets/logo.png" style="width: 70px; height:55px;">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区 -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
        :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单   index不能都是1 且每个栏目的index唯一 且为字符串类型 所以后面加了空字符--> 
         <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id"> 
          <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
               <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
              @click="saveNavState('/'+subitem.path)">
                <template slot="title" >
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subitem.authName}}</span>
                  
               </template>
              </el-menu-item>
            
         </el-submenu>
        </el-menu>
        </el-aside>
        <!-- 右侧边栏 -->
        <el-main>

           <router-view></router-view>

        </el-main>
      </el-container>
    </el-container>
  
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res);
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态(高亮)
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)  //通过sessionStorage保存地址
      // // console.log(this.$router.history.current.path);
      this.activePath = activePath;
      // this.activePath = this.$router.history.current.fullPath;   //一次性把地址保存
      // console.log(this.$router.history.current.fullPath);
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
   height: 100%;
}
.el-header{
  background-color: #363d40;
  color:#fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  font-size: 20px;
  align-items: center;
 >div{
  display: flex;
  align-items: center;
  span{
    margin-left: 10px;
  }
 }
}

.el-aside{
  background-color:#313743;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color:#e9edf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  color:#fff;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>