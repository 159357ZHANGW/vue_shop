<template>
    <div>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          </el-breadcrumb>
          
          <!-- 卡片视图 -->
           <el-card>
              <el-row :gutter="20">
                <el-col :span="8">
                   <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable
                    @clear="getGoodsList">
                      <el-button slot="append" icon="el-icon-search" 
                       @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
              </el-row>

              <!-- table表格 -->
              <el-table :data="goodslist" border stripe>
               <el-table-column type="index" label="#"></el-table-column>
               <el-table-column label="商品名称" prop="goods_name"></el-table-column>
               <el-table-column label="商品价格(元)" prop="goods_price"  width="95px"></el-table-column>
               <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
               <el-table-column label="商品时间" prop="add_time" width="140px">
                  <template slot-scope="scope">
                      {{scope.row.add_time | formatDate}}
                  </template>
               </el-table-column>
               <el-table-column label="操作" width="130px">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
                </template>
               </el-table-column>

              </el-table>

              <!-- 分页
              current-page是当前是第几页  -->
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


    </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize:10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total:0
    }
  },

  created(){
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
     const {data:res} = await this.$http.get('goods', {
        params:this.queryinfo
     })
  
      if (res.meta.status != 200) {
        return this.$message.error("获取信息失败!")
      }
      this.$message.success("获取信息成功！")
        console.log(res.data.goods);
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 页面大小改变
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getGoodsList()
    },
    // 当前页面的页数变化
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getGoodsList()
    },
   async removeById(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)

     if (confirmRes !== 'confirm') {
        this.$message.info('已取消删除!')
     }
    const {data:res} = await this.$http.delete(`goods/${id}`)
     if (res.meta.status !== 200) {
      return this.$message.error('删除失败!')
     }
     this.$message.success('删除成功!')
     this.getGoodsList()
    },
    goAddpage() {
    this.$router.push('/goods/add')
   }

   }
}
</script>

<style lang="less" scope>

</style>