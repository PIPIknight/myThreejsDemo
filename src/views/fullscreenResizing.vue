<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">
        <h3>画布调整(Resizing)</h3>
        <p>canvas尺寸调整分三步。</p>
        <p>&nbsp;&nbsp; 1. 更新size，即画布的宽高更新。</p>
        <p>
          &nbsp;&nbsp; 2.
          更新camera，由于宽高变化，所以相机的宽高比（camera.aspect）也发生了变化
          核心api是
          <span syle="color:red"> updateProjectionMatrix </span>
          ,执行camera.updateProjectionMatrix();的时候，threejs会重新计算相机对象的投影矩阵值。
        </p>
        <p>
          &nbsp;&nbsp; 3. 更新renderer，全部重新渲染。同时可调用<span
            syle="color:red"
          >
            setPixelRatio
          </span>
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          设置canvas的像素比为当前设备的屏幕像素比，避免高分屏下模糊。
        </p>
        <h3>双击全屏(FullScreen)</h3>
        <p>
          画布处理与Resizing相同，重点在于对
          <strong>Element.requestFullscreen()</strong> 的使用和兼容性处理。
        </p>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "FullscreenResizing",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

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
    let sizes = {
      width: 800,
      height: 500,
    };

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);

    onMounted(() => {
      /**
       * Sizes
       */
      sizes = {
        width: outer.value.clientWidth,
        height: outer.value.clientHeight - 300,
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
       * Controls
       */
      const controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = true;

      /**
       * Resizing
       */
      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = outer.value.clientWidth;
        sizes.height = outer.value.clientHeight - 300;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Fullscreen
       */
      window.addEventListener("dblclick", () => {
        const fullscreenElement =
          document.fullscreenElement || document.webkitFullscreenElement;

        if (!fullscreenElement) {
          if (canvas.value.requestFullscreen) {
            canvas.value.requestFullscreen();
          } else if (canvas.value.webkitRequestFullscreen) {
            canvas.value.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      });

      /**
       * Update
       */
      const tick = () => {
        // Update controls
        controls.update();

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
    };
  },
};
</script>

<style lang="scss" scoped>
.outer {
  height: 100%;
  width: 100%;
  .content {
    height: 300px;
    padding: 20px;
    h3,
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
