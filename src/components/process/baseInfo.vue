<template>
  <div class="baseInfo">
    <div class="title">{{ title }}</div>
    <div class="content" v-for="(row, i) in infoList" :key="i">
      <div class="groupNmae">{{ row.groupName }}</div>
      <div class="form-content">
        <el-row class="infoItem" v-for="(array, j) in row.list" :key="j">
          <el-col :span="24 / maxCol" v-for="el in array" :key="el.name">
            <div class="row-text" v-show-tip>
              <el-tooltip placement="top" :content="el.label">
                <span>{{ el.label + '：' }}</span>
              </el-tooltip>
            </div>
            <span class="value" v-html="el.displayValue || el.value.display"></span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- <div class="infoBox clearfix">
      <el-row class="infoItem" v-for="(row, i) in infoList" :key="i">
        <div class="groupNmae">{{ row.groupName }}</div>
        <el-col :span="24 / maxCol" v-for="item in row.items" :key="item.id">
          <span class="label">{{ item.label }}： </span>
          <span class="value" v-html="item.displayValue || item.value.display"></span>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
import { getInfoPageAttrs } from '@/api/process';
export default {
  name: 'baseInfo',
  props: {
    title: {
      type: String,
    },
    list: {
      type: Array,
    },
    oid: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      infoList: [],
    };
  },
  computed: {
    maxCol() {
      let max = 1;
      this.infoList.forEach((item) => {
        item.list.forEach((el) => {
          if (max < el.length) {
            max = el.length;
          }
        });
      });
      return max;
    },
  },
  watch: {
    list: {
      handler(val) {
        this.infoList = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    if (this.oid && !this.list) {
      this.getInfo();
    }
  },
  mounted() {},
  methods: {
    getInfo() {
      let param = {
        oid: this.oid,
      };
      getInfoPageAttrs(param).then((res) => {
        if (res.success) {
          this.infoList = this.$formatData(res.data);
        } else {
          this.$message.error(res);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.baseInfo {
  margin-bottom: 16px;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .content {
    // padding: 20px 20px 20px 20px;
    border-bottom: 1px solid #ccc;
    .groupNmae {
      font-size: 16px;
      font-weight: bolder;
    }
    .form-content {
      .infoItem {
        height: 30px;
        line-height: 30px;
        margin-bottom: 12px;
        .row-text {
          float: left;
          width: 160px;
          text-align: right;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .value {
          float: left;
          width: calc(100% - 160px);
          // padding-left: 10px;
        }
      }
    }
  }
  // .infoBox {
  //   padding-bottom: 20px;
  //   border-bottom: 1px solid #ccc;
  //   min-height: 80px;
  //   .infoItem {
  //     height: 30px;
  //     line-height: 30px;
  //     .label {
  //       float: left;
  //       width: 160px;
  //       text-align: right;
  //       color: #333;
  //     }
  //     .value {
  //       float: left;
  //       width: calc(100% - 160px);
  //       // padding-left: 10px;
  //     }
  //   }
  // }
}
</style>
