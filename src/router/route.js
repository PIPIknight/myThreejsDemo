export const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/transformObj",
    name: "TransformObj",
    component: () => import("@/views/transformObj.vue"),
    meta: {
      title: "物体移动",
    },
  },
  {
    path: "/animateCamera",
    name: "AnimateCamera",
    component: () => import("@/views/animateCamera.vue"),
    meta: {
      title: "动画与帧刷新",
    },
  },
  {
    path: "/cameras",
    name: "Cameras",
    component: () => import("@/views/cameras.vue"),
    meta: {
      title: "摄像机",
    },
  },
  {
    path: "/fullscreenResizing",
    name: "FullscreenResizing",
    component: () => import("@/views/fullscreenResizing.vue"),
    meta: {
      title: "全屏/尺寸/像素调整",
    },
  },
];
