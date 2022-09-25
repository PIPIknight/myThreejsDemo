<template>
  <div id="app" class="app-main">
    <div class="app-main-left">
      <el-menu
        router
        :default-active="activeIndex"
        class="app-main-list"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in routeList"
          :index="item.path"
          :key="item.path"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="app-main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { routes } from "./router/route";

export default {
  name: "App",
  setup() {
    let routeList = reactive([]);
    routeList = routes.slice(1).map((item) => {
      const path = item.path;
      const title = item.meta.title;
      return {
        path,
        title,
      };
    });
    return {
      routeList,
    };
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  .app-main-left {
    height: 100%;
    float: left;
    width: 20vw;
    padding: 10px 0px 10px 10px;
    .app-main-listP {
      font-size: 24px;
    }
  }
  .app-main-right {
    height: 100%;
    margin-left: 20vw;
    background-color: #e9e9eb;
    padding: 20px;
  }
}

:deep(.el-menu-item) {
  font-size: 18px;
}

:deep(.el-menu-item.is-active) {
  font-weight: 700;
  background-color: rgba(200, 200, 200, 0.5);
}
</style>
