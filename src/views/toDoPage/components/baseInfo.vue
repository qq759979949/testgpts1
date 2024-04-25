<template>
  <div class="baseInfo">
    <div class="title">{{ title }}</div>
    <div class="infoBox clearfix">
      <el-row class="infoItem" v-for="(row, i) in infoList" :key="i">
        <el-col :span="24 / maxCol" v-for="item in row.items" :key="item.id">
          <span class="label">{{ item.label }}：</span>
          <span class="value" v-html="item.value"></span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getAttributeGroup } from '@/api/project';
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
      this.infoList.forEach((row) => {
        if (max < row.items.length) {
          max = row.items.length;
        }
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
      return getAttributeGroup(param).then((res) => {
        if (res.success) {
          this.infoList = res.data[0].rows;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.baseInfo {
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .infoBox {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    min-height: 80px;
    .infoItem {
      height: 30px;
      line-height: 30px;
      .label {
        float: left;
        width: 160px;
        text-align: right;
        color: #333;
      }
      .value {
        float: left;
        width: calc(100% - 160px);
        // padding-left: 10px;
      }
    }
  }
}
</style>
