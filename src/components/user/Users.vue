<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
        <!-- 搜索框 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList">
               <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
               <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
          <!-- 用户列表区域 -->
          <el-table :data="userlist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
              <template slot-scope="scope">
                        <!-- {{scope.row}}  代表这一行的所有数据  -->
                <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>           
            
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  @click="handleEdit(scope.$id, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$id, scope.row)">删除</el-button> -->
                  <!-- 修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                  <!-- 删除按钮 -->
                  <template>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserByid(scope.row.id)"></el-button>
                  </template>
                  <!-- 分配权限 -->
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                  </el-tooltip>
 
              </template>
            </el-table-column>
          </el-table>
          <!-- 页码 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="restDialog">
        <!-- 内容主题区 --> 
          <el-form :model="addForm" :rules="addFormRules" 
          ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
             <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            
          </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
          <!-- <el-button @click="restDialog()">重置</el-button>    -->
          <el-button @click="resetForm('addFormRef')">重置</el-button>
          
      </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%" @close="resetForm('editFormRef')">
         <el-form :model="editForm" :rules="editFormRules" 
          ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
             <el-form-item label="电话" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo('editFormRef')">确 定</el-button>
          <el-button @click="resetForm('editFormRef')">重置</el-button>
        </span>
      </el-dialog>
       <!-- 分配角色的对话框 -->
       <el-dialog
          title="提示"
          :visible.sync="setRoleDialogvisible"
          width="30%" @close="setRoleDialogClosed">
          <div>
            <p>用户:{{userinfo.username}}</p>
            <p>角色:{{userinfo.role_name}}</p>
            <p>分配新角色:
              <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                  <!-- 上面的label 是看到的值 所以看到的值应该是姓名 -->
                </el-option>
              </el-select>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogvisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleinfo">确 定</el-button>
          </span>
        </el-dialog>
</div>
</template>

<script>
export default {
  data() {
       // 邮箱验证
      const checkEmail = (rule, value, cb) => {
         const regMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (regMail.test(value)) {
           cb()
        } else {
          cb(new Error('格式不正确!'))
         }
      }
      // 手机号码验证
      var checkMobile = (rule, value, cb) => {
         const reMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (reMobile.test(value)) {
           cb()
        } else {
          cb(new Error('手机号码格式不正确!'))
         }
      }
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize:2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile:''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true, message: '请输入用户名',
            trigger: 'blur'
          }, {
            min:3,max:10,message:'用户名长度为3-10',trigger:'blur'
          }
        ],
        password: [
           {
            required: true, message: '请输入密码',
            trigger: 'blur'
          }, {
            min:6,max:15,message:'用户名长度为6-15',trigger:'blur'
          }
        ],
        email: [
           {
            required: true, message: '请输入邮箱',
            trigger: 'blur'
          },
          {  validator:checkEmail,trigger:'blur' }
        ],
        mobile: [
           { required: true, message: '请输入电话号码',trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {  validator:checkEmail,trigger:'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码',trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色的对话框显示与隐藏
      setRoleDialogvisible: false,
      // 需要被分配校色的用户信息
      userinfo: {},
      //所有角色的数据列表
      rolesList: [],
      selectedRoleId:''

      
    }
  },
  created(){
      this.getUserList()
  },
  methods: {
   async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.total = res.data.total;
      console.log(res.data.users);
      this.userlist = res.data.users
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryinfo.pagesize = newSize;
      this.getUserList()
    },
    // 监听 页码值 改变的条件
    handleCurrentChange(newPage) {
      //  console.log(newPage);
      this.queryinfo.pagenum = newPage; 
      this.getUserList()
    },
    async userStateChange(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;  // 操作失败后 虽然数据库中数据没有更新 但是页面上已经变化了 所以得和数据库保持一致
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 下面两个都是关闭函数 功能一样 按钮和关闭叉都是相同效果
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    restDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加用户
    addUser(formName) {
      this.$refs[formName].validate(async(valid) => {
          // console.log(valid);
          if (!valid)  return
          { let {data:res} = await this.$http.post('users', this.addForm)
            if (res.meta.status != 201) {
              this.$message.error('添加用户失败！')
            }
              this.$message.success('添加用户成功！')
            //隐藏添加用户的对话框 
            this.addDialogVisible = false
            // 重新获取用户列表数据
            this.getUserList()
          }
        });
    },
    // 展示编辑用户的对话框
   async showEditDialog(id) {
      this.editDialogVisible = true;
      //  console.log(id);
    //  let { data: res } = await this.$http.get(`users${id}`)
     let { data: res } = await this.$http.get('users/' +id)
    //  this.$http.get(`users${id}`)   'users/' +id   这两个方法都可以
     if (res.meta.status != 200) {
      return this.$message.error('查询用户信息失败!')
      }
     this.editForm = res.data
     console.log(res.data);
    },
    // 修改用户信息并提交
     editUserInfo(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        // `users/${this.editForm.id}`  这两个方法都可以
        // 'users/'+this.editForm.id
      let {data:res} =  await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile:this.editForm.mobile
      })  
        if (res.meta.status !== 200) {
         return this.$message.error('修改失败!')
        }
        // 关闭对话框
        this.editDialogVisible = false
        //  更新数据
        this.getUserList()
        // 提示成功
        this.$message.success('修改数据成功!')
     }) 
   
    },
    // 删除
    async removeUserByid(id) {
      let confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      //如果用户确定删除 则返回字符串confirm
      //如果用户取消删除 则返回字符串cancel
      // console.log(confirmResult);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      let { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
  //  展示分配角色的对话框
   async setRole(userinfo) {
     this.userinfo = userinfo;
      // 在展示对话框之前 获得所有角色的列表
     const { data: res } = await this.$http.get('roles');
     this.rolesList = res.data;

     this.setRoleDialogvisible = true
    },
    //点击按钮分配角色
   async saveRoleinfo() {
      if (!this.selectedRoleId) {   //selectedRoleId取反是true的话 说明还是空
          return this$message.error('请选择要分配的角色：')                      
      }
     const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{
        rid:this.selectedRoleId
      }) 
     if (res.meta.status != 200) {
       return this.$message.error('更新角色失败！')
     } 
      this.$message.success('更新角色成功!')
      this.getUserList()

      this.setRoleDialogvisible = false
    },
    // 监听分配角色
    setRoleDialogClosed() {
      this.selectedRoleId = '';
      this.userinfo = ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>