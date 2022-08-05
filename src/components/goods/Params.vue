<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
  
<!-- 卡片视图 -->
     <el-card>
      <!-- 警示框 -->
         <el-alert title="注意:只允许为第三方分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
        <!-- 选择商品分类的 -->
         <el-row class="cat_opt"> 
          <el-col>
            <span> 选择商品分类:</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader
              expand-trigger="hover" :options="CateList"
              :props="cateProps"
              v-model="selectedKeys" @change="handleChange"
             >
            </el-cascader>
          </el-col>
         </el-row>
  <!-- Tabs页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
  <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
        <!-- 动态属性表格 -->
        <el-table :data="manyTableData" border stripe>
        <!-- 展开行 -->
          <el-table-column type="expand">
              <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
              <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" 
                 size="small" @click="showInput(scope.row)">
              + New Tag
             </el-button>
                
              </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        
        </el-table>
    
    </el-tab-pane>
  <!-- 添加静态属性的面板 -->
    <el-tab-pane label="属性名称" name="only">
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
        <!-- 静态属性表格 -->
        <el-table :data="onlyTableData" border stripe>
          <el-table-column type="expand">
              <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
              <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" 
                 size="small" @click="showInput(scope.row)">
              + New Tag
             </el-button>
                
              </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        
        </el-table>
    </el-tab-pane>
   
  </el-tabs>
     </el-card>
     
     <!-- 添加参数的对话框 -->
     <el-dialog :title="`添加${titleText}`" :visible.sync="addDialogVisible" 
     width="50%" @close="addDialogClosed">
       <!-- 添加参数的对话框 -->
        <el-form :model="addForms" :rules="addFormRules" ref="addFormRef" label-width="100px">
           <!-- props是提交的表单身上的name名称  具体看请求中参数的名称 -->
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForms.attr_name"></el-input>
          </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
     </el-dialog>

    <!--修改的对话框 -->
      <el-dialog :title="`修改${titleText}`" :visible.sync="editDialogVisible" 
     width="50%" @close="editDialogClosed">
       <!-- 添加参数的对话框 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
           <!-- props是提交的表单身上的name名称  具体看请求中参数的名称 -->
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 删除的对话框 -->
      
   </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      CateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数据id
      selectedKeys: [],
      // 默认激活页签的页签名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制对话框的显示隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForms: {},
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 修改数据的对话框显示与隐藏
      editDialogVisible: false,
      // 修改对话框中的数据
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 删除表单的数据对象
      deleteDialogVisible:false,
      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
     const {data:res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
      return this.$message.error("获取信息失败!")
      }
      
      this.CateList = res.data;
    },
    // 级联选择框选中项变化，会触发这个函数
   async handleChange() {
     this.getParamsData()
    
    },
    // tab页签 点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
         // 证明选中的不是三级分类
          if (this.selectedKeys.length!==3) {
            this.selectedKeys = [];
            this.manyTableData = [];
            this.onlyTableData = [];
            return
        }
            // 证明选中的就是三级分类 里面寸的是 三个级的id值
        console.log(this.selectedKeys);
          // 根据所选分类的Id，和当前所处的面板，获取对应的参数
        const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`,
          { params: { sel: this.activeName } })
        if (res.meta.status !== 200) {
            return this.$message.error("获取信息失败！")
      }
      //  将展开行中的数据由字符串转换为数组
      //  通过三元表达式
       res.data.forEach(item => {
         item.attr_vals = item.attr_vals ?
           item.attr_vals.split(' ') : []

          //  为每一行提供单独的显示隐藏和 输入内容
         // 可书写标签的显示与隐藏
         item.inputVisible = false;
            // 文本框中输入的内容
          item.inputValue = ''
        })
      console.log(res.data); 

        
      if(this.activeName == 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }  
    },
    //监听对话框关闭
    addDialogClosed() {
       this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加参数
    addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data:res } = await this.$http.post(`categories/${this.catId}/attributes`, {
            attr_name: this.addForms.attr_name,
            attr_sel:this.activeName
          })

        if (res.meta.status !== 201) {
            return this.$message.error('发生数据失败！')
          }
           this.$message.success('添加数据成功!')
          this.addDialogVisible = false;
          this.getParamsData( )
         });
    }, 
    // 点击按钮显示对话框
   async showEditDialog(attr_id) {
     const {data:res} = await this.$http.get(`categories/${this.catId}/attributes/${attr_id}`, {
        params:{attr_sel:this.activeName}
     })
     console.log(res.meta.status);
     if (res.meta.status !== 200) {
        return this.$message.error("获取信息失败!")
     }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭对话框的事件函数
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate( async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.catId}
                 /attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
      })
        if (res.meta.status != 200) {
          return this.$message.error("修改失败!")
        }
        //  this.editForm.attr_name = res.data.attr_name
        this.getParamsData()
        this.editDialogVisible = false      })
    },
    // 删除按钮
   async deleteDialog(attr_id) {
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
     }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info("取消删除")
      }


     const {data:res} = await this.$http.delete(`categories/${this.catId}/attributes/
        ${attr_id}`)
      if (res.meta.status != 200) {
        this.$message.error("删除失败!")
      }
      this.$message.success("删除成功!")

      this.getParamsData()
      this.deleteDialogVisible = true
    },
    // 文本框失去焦点 或者 按下了enter键
   async handleInputConfirm(row) {
      // 先检验是否 输入的内容为空 为空则清空
      // 并失去焦点时候 又变为按钮  
      if (row.inputValue.trim().length == 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue =''
      row.inputVisible = false
      // 将修改的数据 上传到数据库中
     this.saveAttrVals(row)

    },
    async saveAttrVals(row) {
         const{data:res} = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
        attr_name:row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
     })
     if (res.meta.status !== 200) {
       return this.$message.error("修改失败!")
     }
      this.$message.success("修改成功!")    
   },
    // 点击按钮展示输入框 展示文本输入框
    showInput(row) {
      // 点击按钮时候 变为文本框
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素
      //  被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除标签
    handleClose(i, row) {
      // 删除索引为i的元素后 attr_vals数组 除了索引为i的数据都有
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)    
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length != 3) {
        return true
      } else {
        return false
      }
    },
    catId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      }
      return null
    },
    titleText() {
     return this.activeName=='many'? '动态属性':'静态属性'
    },
    rtdata() {
      return this.activeName == 'many' ? this.manyTableData : this.onlyTableData;
    }
   }
}
</script>
     
<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 120px;
}
</style>