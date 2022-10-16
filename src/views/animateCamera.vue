<template>
  <div ref="outer" id="animate-camera" class="animate-camera">
    <div class="article-area">
      <div class="article-content">
        <h3 style="margin-bottom: 20px">
          ThreeJS动画的核心是requestAnimationFrame事件
        </h3>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b>window.requestAnimationFrame(callback)</b>
          告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;
          不难看出，callback控制“画”果，requestAnimationFrame的触发频率控制“动”！其中callback回调所做的，其实是不断重新渲染canvas画布，即不断render在Mounted阶段创建的new
          THREE.WebGLRenderer()实例，进行画布的刷新。在callback的最后，调用window.requestAnimationFrame(callback)从而达到循环调用。
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp; 对于时间的控制，可以采用
          <span style="color: red">Date.now()</span> 和
          deltaTime(通常作为移动参量) 控制。也可以采用
          <span style="color: red">new THREE.Clock()</span> 和其api
          <span style="color: red">getElapsedTime</span
          >(一个持续记录的值，与deltaTime不同，他是Clock建立后持续记录的时间，即Clock存在的时长)
          控制。
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <em>备注:</em>
          若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用
          window.requestAnimationFrame()。更多详情见MDN上对其解释
          <a
            href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame"
            target="_blank"
          >
            window.requestAnimationFrame
          </a>
        </p>
        <span
          >&nbsp;&nbsp;&nbsp;&nbsp;动画效果，可以采用GSAP动画库<a
            href="https://greensock.com/"
            target="_blank"
            >GSAP动画库链接</a
          ></span
        >
      </div>
      <div class="article-controller">
        <el-button type="primary" class="buttons" @click="goGsap">
          清除动画效果，并触发一次gsap动画
        </el-button>
        <el-button type="primary" class="buttons" @click="goDateNow">
          切换至Date.now()动画
        </el-button>
        <el-button type="primary" class="buttons" @click="goThreeClock">
          切换至THREE.Clock()动画
        </el-button>
        <el-button type="primary" class="buttons" @click="resetScene">
          复位
        </el-button>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import gsap from "gsap";
export default {
  name: "AnimateCamera",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ————————————————————————————————————————————————————————————————————————————

    // ————————————————————————————————————————————————————————————————————————————
    const sizes = {
      width: 800,
      height: 500,
    };

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    const outer = ref();

    // GSAP
    const gsapFunc = () => {
      gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
      gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
    };

    // Time
    let time = Date.now();
    const timeFunc = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - time;
      time = currentTime;
      if (mesh.position.x >= -2.5) {
        mesh.position.x -= 0.001;
      }
      mesh.rotation.y += 0.001 * deltaTime;
    };

    // Clock
    const clock = new THREE.Clock();
    const clockFunc = () => {
      const elapsedTime = clock.getElapsedTime();
      //   mesh.rotation.y = elapsedTime
      //   mesh.rotation.y = elapsedTime * Math.PI;
      mesh.position.y = Math.sin(elapsedTime);
      mesh.position.x = -Math.cos(elapsedTime);
      camera.lookAt(mesh.position);
    };

    let currFunc = ref(1);
    const goGsap = () => {
      currFunc.value = 0;
      setTimeout(() => {
        gsapFunc();
      }, 100);
    };
    const goDateNow = () => {
      currFunc.value = 1;
    };
    const goThreeClock = () => {
      currFunc.value = 2;
    };
    const resetScene = () => {
      currFunc.value = 0;
      setTimeout(() => {
        mesh.rotation.y = 0;
        mesh.position.y = 0;
        mesh.position.x = 0;
        camera.lookAt(mesh.position);
      }, 100);
    };

    onMounted(() => {
      /**
       * Sizes
       */
      const sizes = {
        width: outer.value.clientWidth,
        height: outer.value.clientHeight - 400,
      };

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.render(scene, camera);

      /**
       * Update
       */
      const tick = () => {
        if (currFunc.value === 1) {
          timeFunc();
        } else if (currFunc.value === 2) {
          clockFunc();
        } else {
          () => {};
        }

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    });

    return {
      canvas,
      outer,
      goGsap,
      goDateNow,
      goThreeClock,
      resetScene,
    };
  },
};
</script>

<style lang="scss" scoped>
.animate-camera {
  height: 100%;
  width: 100%;
  background-color: #fff;
  font-size: 16px;
  .article-area {
    display: flex;
    height: 400px;
    padding: 20px;
    .article-content {
      flex: 3;
      p,
      span {
        margin-bottom: 20px;
        line-height: 22px;
      }
    }
    .article-controller {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 20px;
      .buttons {
        margin: 20px 0;
      }
    }
  }
}
.webgl {
  background-color: lime;
}
</style>
