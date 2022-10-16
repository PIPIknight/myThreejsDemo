<template>
  <div ref="outer" id="outer" class="outer">
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "lil-gui";
export default {
  name: "Gui",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    // 为了配合GUI，对颜色的特殊处理，动作之类加入parameters
    const parameters = {
      color: 0xff0000,
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 1,
          y: mesh.rotation.y + Math.PI * 2,
        });
      },
    };

    /**
     * Objects
     */
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: parameters.color });
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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    onMounted(() => {
      /**
       * Sizes
       */
      sizes = {
        width: outer.value.clientWidth,
        height: outer.value.clientHeight,
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

      // GUI
      // const gui = new dat.GUI();
      const gui = new dat.GUI({ closed: true, width: 400 });
      // gui.add(mesh.position, "y", -2, 2, 0.01);
      gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
      gui.add(mesh, "visible");
      gui.add(material, "wireframe");
      gui.addColor(parameters, "color").onChange(() => {
        //   console.log(parameters.color);
        material.color.set(parameters.color);
      });
      gui.add(parameters, "spin");
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
}
</style>
