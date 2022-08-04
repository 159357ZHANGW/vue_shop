<template>
  <div>
   <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

<!-- 卡片视图 -->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          </el-col>
        </el-row>

        
      <!-- 表格 -->
        <tree-table class="treeTable" :data="catelist" :selection-type="false" :columns="columns" show-index 
        :expand-type="false" border>
            
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
              <i class="el-icon-error" v-else style="color:red;"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===1" >二级</el-tag>
              <el-tag size="mini" v-else type="warning">三级</el-tag>
            </template>
            <!-- 操作模板 -->
            <template slot="opt" slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>              
            </template>
        </tree-table>

      <!-- 分页区域 

      current-page 是显示当前 展示的第几页
      page-sizes 每页显示多少条数据
      page-size 绑定当前显示多少条
      total是绑定到查询的总数据条数
      -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    
    <!-- 对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClosed">
          <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称:" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:">
              <!-- :options是指定数据源的 
                    props用来指定配置对象
                    
                    v-model 必须绑定数组
              -->
              <el-cascader  :options="parentCateList"
                :props="{expandTrigger:'hover',checkStrictly:true, ...cascaderProps}"
                v-model="selectedKeys" @change="parentCateChanged" clearable
                change-on-select>
              </el-cascader>
              </el-form-item>
            </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

    
    
    </el-card>


  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize:5
      },
      // 总数居数量
      total:0,
      // 商品分类的数据列表
      catelist: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop:'cat_name'
        }, {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template:'isok'
        }, {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template:'order'
        }, {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template:'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        //父级分类Id
        cat_id: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level:0 
      },
      // 分类表单的验证规则
      addCateFormRules: {
           cat_name: [
            { required: true, message: '请输分类名称', trigger: 'blur' },
        ]
      },
       // 获取父级分类的列表
        parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',   //具体选中的哪个值的属性
        label: 'cat_name',  //看到的哪个属性
        children:'children'  //父子嵌套用的哪个属性
        },
        // 选中的父级分类的Id数组
       selectedKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
   async getCateList() {
    const {data:res} = await this.$http.get('categories', {
        params:this.queryinfo
    })
    console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类失败!')
      }
      // 吧数据列表，赋值给catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize变化
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的变化
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      // 刷新数据列表
      this.getCateList();
    },
    // 点击按钮添加 展示对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表
      this.getParentCateList()
      // 再展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
     const {data:res} = await this.$http.get('categories', {
        params: {
          type:2
        }
     })
      if (res.meta.status != 200) {
      return this.$message.error("获取父级分类数据失败!")
     }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_id = this.selectedKeys[this.selectedKeys.length - 1]
        //当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_id = 0;
        this.addCateForm.cat_level = 0;
        }
    },
    // 点击按钮添加新的分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data:res} = await this.$http.post('categories',this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error("添加数据失败")
        } 
        this.$message.success("添加数据成功")
        
        this.getCateList()
         this.addCateDialogVisible = false

      }) 
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
  //  this.addCateDialogVisible = false
      this.addCateForm.cat_id = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    }

  }
}
</script>

<style lang="less" scoped>
 .treeTable{
  margin-top: 15px;
 }
 .el-cascader{
  width: 100%;
 }

</style>