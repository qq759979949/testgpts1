<template>
  <div>
    <el-select
      v-model="data[option.name_]"
      placeholder="请至少输入2个字符查找"
      :multiple="!option.single"
      filterable
      :disabled="!!option.readOnly ? true : false"
      remote
      :remote-method="remoteMethod"
      @change="changeSelect"
    >
      <el-option v-for="item in option.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'remoteSelect',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    outParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      options: [],
    };
  },
  computed: {
    paramsOut() {
      return this.outParams;
    },
  },
  created() {},
  mounted() {},
  methods: {
    remoteMethod(query) {
      if (query && query.length >= 2) {
        let param = {};
        param.keyword = query;
        this.getOptions(param);
        return;
      }
      this.handleClear();
    },
    getOptions(param) {
      this.$http({
        url: this.option.api.url,
        method: this.option.api.method,
        data: param,
      }).then((res) => {
        if (res.success) {
          this.$set(this.option, 'options', res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    changeSelect() {
      // this.$forceUpdate();
      this.handleClear();
    },
    handleClear() {
      this.$set(this.option, 'options', []);
    },
  },
};
</script>

<style scoped lang="less"></style>
