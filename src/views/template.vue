<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">123</div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive, defineComponent } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default defineComponent({
  name: "",
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
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const mesh = new THREE.Mesh(geometry, material);

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
});
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
