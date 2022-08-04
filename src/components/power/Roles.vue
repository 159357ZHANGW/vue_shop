<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      
  <!-- 卡片视图 -->
    <el-card>
     <!-- 添加角色 -->
     <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
     </el-row>

    <!--角色列表区域-->
    <el-table :data="rolesList" stripe border>
     <!-- 展开列 -->                            
     <el-table-column type="expand">
       <template slot-scope="scope">
        <el-row v-for="(item1 , i1) in scope.row.children" :key="item1.id"
        :class="['bdbottom','vcenter',i1 ===0 ? 'bdtop':'']">
          <!-- 渲染一级权限 -->
          <el-col :span="5">
            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 渲染二、三级权限 -->
          <el-col :span="19">
            <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="['vcenter',i2===0 ? '':'bdtop']">
              <!-- 二级 -->
              <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 三级 -->
              <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
            
              </el-col>
         
              <el-col>

              </el-col> 
            </el-row>
          </el-col>  
          

        </el-row>
       </template>
       
     </el-table-column>

     <!-- 索引列 -->
     <el-table-column label="#" type="index"></el-table-column>
     <el-table-column label="角色名称" prop="roleName"></el-table-column>
     <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
     <el-table-column label="操作" width="300px">
      <template slot-scope="scope">
          
                  <!-- 修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                  <!-- 删除按钮 -->
                  <template>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </template>
                  <!-- 分配权限 -->
                  <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                  </el-tooltip>
 
              </template>
     </el-table-column>
    </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightDialongVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id"
        :default-checked-keys="defKeys" default-expand-all ref="treeRef">
       
      </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialongVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { errorMonitor } from 'events'
// import { info } from 'console'

export default {
  data() {
    return {
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏 
      setRightDialongVisible: false,
      // 所有权限数据
      rightslist: [],
      // 树形空间的属性绑定对象
      treeProps: {
        children: 'children', //父子结点，通过哪个属性来嵌套的
        label:'authName'    //看到的是哪个属性绑定的值   
      },
      // 默认选中的结点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取列表失败！')
      }
      this.rolesList = res.data;

      console.log(this.rolesList);
    },
    // 根据id删除权限
   async removeRightById(role,rightId) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
     if (result != 'confirm') {
      return this.$message.info('取消了删除！');
     }
   const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
     if (res.meta.status !== 200) {
     return this.$message.error('删除失败！')
     }else{
    role.children = res.data
      
     }               
    },
    async showSetRightDialog(role) {
      this.setRightDialongVisible = true
      this.roleId = role.id
    const {data:res} = await this.$http.get('rights/tree')

     if (res.meta.status != 200) {
       return this.$http.error("获取权限失败!")
     } 
    
      this.rightslist = res.data
     console.log(this.rightslist);
  //  获取三级结点
     this.getLeafKeys(role, this.defKeys)
    
    },

    // 通过递归获取三级权限的id 并保存倒defkeys数组中
    getLeafKeys(node, arr) {
    //如果当前node结点不包含children属性 则是三级结点
      if (!node.children) {
        return arr.push(node.id)
      }
         node.children.forEach(item =>
         this.getLeafKeys(item,arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys=[]
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(',')
     
    const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,
      {rids:idStr})
     if (res.meta.status != 200) {
      return  this.$message.error('分配权限失败!')   
     }
      this.getRolesList()
      this.setRightDialongVisible = false
    }
                                       
   
  }
}

</script>

<style lang="less" scoped>
 .el-tag{
  margin: 8px;
 }
 .bdtop{
  border: 1px solid #eee;
 }
 .bdbottom{
  border: 1px solid #eee;
 }
 .vcenter{
  display: flex;
  align-items: center;
 }
</style>