<template>
<!-- 数据报表的功能 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试视图区域 -->
    <el-card class="box-card">
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 1000px;height:450px;"></div>
    </el-card>

  </div>
</template>

<script type="text/ecmascript-6">
// 1.引入 echarts.js 
import echarts from 'echarts'
// 引入lodash
import _ from 'lodash'
  export default {
    data() {
      return {
        // 需要合并的选项数据对象
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created() {
      
    },
    // 此时,页面上的元素,已经被渲染完毕了!
    async mounted() {
      
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      // 4.指定图表的配置项和数据
      /* var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data:['销量']
        },
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }; */

      // 获取报表数据的请求
      let { data:res } = await this.$http.get('reports/type/1')
      if(res.meta.status !== 200) return this.$message.error("获取报表数据失败！")
      // 合并对象
      let mergeObj = _.merge(res.data,this.options)
      // 5.使用刚指定的配置项和数据显示图表。
      // myChart.setOption(option);
      // myChart.setOption(res.data);
      myChart.setOption(mergeObj);
    },
    methods: {
      
    },
  }
</script>

<style lang="less" scoped>

</style>
