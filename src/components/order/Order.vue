<template>
  <div>
   <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
          </el-breadcrumb>


    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable>

          <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格 -->
              <el-table :data="orderList" border stripe>
               <el-table-column type="index" label="#"></el-table-column>
               <el-table-column label="订单编号" prop="order_number"></el-table-column>
               <el-table-column label="订单价格" prop="order_price"></el-table-column>
               <el-table-column label="是否付款" prop="pay_status">
                 <template slot-scope="scope">
                  <el-tag v-if="scope.row.pay_status=='1'" type="success">已付款</el-tag>
                  <el-tag v-else type="danger">未付款</el-tag>
                 </template>
               </el-table-column>
               <el-table-column label="是否发货" prop="is_send"></el-table-column>
               <el-table-column label="下单时间" prop="create_time">
                  <template slot-scope="scope">
                      {{scope.row.create_time | formatDate}}
                  </template>
               </el-table-column>
               <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showbox"></el-button>
                    <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
                  </template>
               </el-table-column>

              </el-table>

      <!-- 分页
              current-page是当前是第几页 
              page-size是当前页面显示多少条
              -->
               <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"  
                :page-size="queryinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
              </el-pagination>
    </el-card>

<!-- 修改信息的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close="closedialog">
      
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!-- v-model 是双向绑定的值会绑定到哪里 -->
           <el-cascader
              expand-trigger="hover"
              :options="citydata"
              v-model="addressForm.address1">
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流信息的对话框 -->
    <el-dialog
        title="物流进度" :visible.sync="ProgressVisible" width="50%">
        
        <!-- 时间线-->
       <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline> 
      </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize:10
      },
      total: 0,
      // 订单列表数组
      orderList: [],
      addressVisible: false,
      addressForm: {
        // address1是级联选择器 应该是数组
        address1: [],
        address2:''
      },
      addressFormRules: {
        address1: [
          {
            required: true, message: '请输入省市区/县',
            trigger: 'blur'
          }
         ],
        address2: [
          {
            required: true, message: '请输入详细地址',
            trigger: 'blur'
          }
         ],
      },
      citydata,
      ProgressVisible: false,
      // 物流信息 
      progressInfo:[]
    }
  },
  created() {
   this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {params:this.queryinfo})
      if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败！")
      }
      this.$message.success('获取数据成功!')
    //  console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getOrderList()
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getOrderList()
    },
    // 修改的对话框
    showbox() {
      this.addressVisible = true;
    },
    closedialog() {
      this.$refs.addressFormRef.resetFields()
    },
   async showProgressBox() {
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
        console.log(res.data);
     this.progressInfo = res.data
      
     console.log(this.progressInfo);
     this.ProgressVisible = true
    }
  },
 
}
</script>

<style lang="less" scoped>
// 下面这些是使得 时间线 样式更加好看
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
  width: 100%;
}
</style>