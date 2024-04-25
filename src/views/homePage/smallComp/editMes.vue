<template>
  <div class="editMes">
    <el-scrollbar max-height="300px">
      <!-- <el-row>
        <el-col :span="6" class="title">宽：</el-col>
        <el-col :span="18"><el-input style="width: 240px"/></el-col>
      </el-row> -->
      <el-row v-if="isClassic">
        <el-col :span="6" class="title">{{ label }}：</el-col>
        <el-col :span="18">
          <el-select
            v-model="checkList"
            multiple
            placeholder="请选择"
            style="width: 240px"
          >
          <draggable
              v-model="optionList"
              item-key="description"
              animation="200"
            >
            <template #item="{element, index}">
              <el-option
                :key="element.description"
                :label="element.description"
                :value="element.description"
              />
            </template>
            </draggable>
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="isNum" class="numMaxSize">
        <el-col :span="6" class="title">最大条数：</el-col>
        <el-col :span="18"><el-input style="width: 240px" v-model="number"/></el-col>
      </el-row>
      <el-row v-if="isFunc">
        <el-col :span="6" class="title">内容：</el-col>
        <el-col :span="18">
          <el-checkbox-group v-model="checkList">
            <draggable
              v-model="optionList"
              item-key="description"
              animation="200"
            >
            <template #item="{element, index}">
              <div>
                <el-checkbox :key="index" :label="element.description"/>
              </div>
            </template>
          </draggable>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
 </template>
 <script>
 import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
 export default defineComponent({
  components: {
    draggable,
  },
  props: {
    LabelName: {
      type: String,
      default: ''
    },
    isFunc : {
      type: Boolean,
      default: false
    },
    isClassic : {
      type: Boolean,
      default: false
    },
    isNum : {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => [],
    }
  },
   setup (props) {
     const Data = reactive({
       label: props.LabelName,
       value1: [],
       checkList: [],
       optionList: [],
       number: null
     })
     onMounted(() =>{
     })
     watch(() => props.options, (n) => {
        Data.optionList = n
     })
     return {
       ...toRefs(Data)
     }
 
   }
 })
 </script>
 
 <style scoped lang='scss'>
 .editMes {
  //  padding: 10px 20px;
  //  height: calc(100vh - 70px - 270px - 40px - 10px);
   .title {
     font-size: var(--el-font-size-medium);
     color: #666;
     font-weight: 500;
     padding: 0 10px 20px 0;
     text-align: left;
   }
   .numMaxSize {
    margin-top: 10px;
   }
 }
 
 </style>