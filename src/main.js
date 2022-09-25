/*
 * @Author: bin.wang 852881230@qq.com
 * @Date: 2022-09-25 16:23:45
 * @LastEditors: bin.wang 852881230@qq.com
 * @LastEditTime: 2022-09-25 16:43:13
 * @FilePath: \myThreejsDemo\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "@/router/index.js";
import "@/common/style/index.scss";

createApp(App).use(router).use(ElementPlus).mount("#app");
