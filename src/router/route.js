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
];
