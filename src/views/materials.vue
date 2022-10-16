<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">
        <div style="margin-bottom: 10px">
          内容太多仅作展示,详情请看代码及查阅官方文档！
        </div>
        <el-button @click="toggleExps('ExpOne')">基本门材质</el-button>
        <el-button @click="toggleExps('ExpTwo')">门材质进化</el-button>
        <el-button @click="toggleExps('ExpThree')">其他材质展示1</el-button>
        <el-button @click="toggleExps('ExpFour')">其他材质展示2</el-button>
        <el-button @click="toggleExps('ExpFive')">其他材质展示3</el-button>
        <el-button @click="toggleExps('ExpSix')">环境贴图</el-button>
      </div>
    </div>
    <component :is="currentComp"></component>
  </div>
</template>

<script>
import { ref } from "vue";
import ExpOne from "./materialExps/exp1.vue";
import ExpTwo from "./materialExps/exp2.vue";
import ExpThree from "./materialExps/exp3.vue";
import ExpFour from "./materialExps/exp4.vue";
import ExpFive from "./materialExps/exp5.vue";
import ExpSix from "./materialExps/exp6.vue";
export default {
  name: "Materials",
  components: {
    ExpOne,
    ExpTwo,
    ExpThree,
    ExpFour,
    ExpFive,
    ExpSix,
  },
  setup() {
    const currentComp = ref("ExpOne");

    const toggleExps = (str) => {
      currentComp.value = str;
    };

    return {
      currentComp,
      toggleExps,
    };
  },
};
</script>

<style lang="scss" scoped>
.outer {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .content {
    height: 100px;
    padding: 20px;
    h3,
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
