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
      title: "纹理的设置",
    },
  },
  {
    path: "/materials",
    name: "Materials",
    component: () => import("@/views/materials.vue"),
    meta: {
      title: "材料设置与展示",
    },
  },
  {
    path: "/3dtext",
    name: "3DText",
    component: () => import("@/views/3DText.vue"),
    meta: {
      title: "3D文字",
    },
  },
];
