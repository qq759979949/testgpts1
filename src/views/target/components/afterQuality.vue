<template>
  <div class="">
    <div>
      <afterSetNumber :isEdit="false"></afterSetNumber>
      <afterDuration :isEdit="false"></afterDuration>
      <afterInterior :isEdit="false"></afterInterior>
      <afterExternal :isEdit="false"></afterExternal>
      <afterMalfunction :isEdit="false"></afterMalfunction>
      <afterLossCost :isEdit="false"></afterLossCost>
    </div>
  </div>
</template>

<script setup>
import afterSetNumber from '@/views/target/components/afterSetNumber.vue'; // 验证台数
import afterDuration from '@/views/target/components/afterDuration.vue'; // 验证时长
import afterInterior from '@/views/target/components/afterInterior.vue'; // 内部问题关闭率
import afterExternal from '@/views/target/components/afterExternal.vue'; // 外部问题关闭率
import afterMalfunction from '@/views/target/components/afterMalfunction.vue'; // 1年内故障率
import afterLossCost from '@/views/target/components/afterLossCost.vue'; // 质量损失成本
</script>

<style lang="less" scoped></style>
