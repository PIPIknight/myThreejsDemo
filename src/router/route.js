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
    path: "/geometry",
    name: "Geometry",
    component: () => import("@/views/geometry.vue"),
    meta: {
      title: "几何体样例",
    },
  },
  {
    path: "/gui",
    name: "GUI",
    component: () => import("@/views/gui.vue"),
    meta: {
      title: "GUI的基本使用",
    },
  },
  {
    path: "/texture",
    name: "Texture",
    component: () => import("@/views/texture.vue"),
    meta: {
      title: "材质的设置",
    },
  },
];
