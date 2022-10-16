<template>
  <div ref="outer" id="exp-outer" class="exp-outer">
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "lil-gui";
export default {
  name: "ExpOne",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const doorColorTexture = textureLoader.load(
      "src/assets/textures/door/color.jpg"
    );
    const doorAlphaTexture = textureLoader.load(
      "src/assets/textures/door/alpha.jpg"
    );
    const doorAmbientOcclusionTexture = textureLoader.load(
      "src/assets/textures/door/ambientOcclusion.jpg"
    );
    const doorHeightTexture = textureLoader.load(
      "src/assets/textures/door/height.jpg"
    );
    const doorNormalTexture = textureLoader.load(
      "src/assets/textures/door/normal.jpg"
    );
    const doorMetalnessTexture = textureLoader.load(
      "src/assets/textures/door/metalness.jpg"
    );
    const doorRoughnessTexture = textureLoader.load(
      "src/assets/textures/door/roughness.jpg"
    );
    // const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
    const gradientTexture = textureLoader.load(
      "src/assets/textures/gradients/5.jpg"
    );

    /**
     * Objects
     */
    const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      material
    );
    sphere.position.x = -1.5;

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 100, 100),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
      material
    );
    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    /**
     * Lights Material
     */
    // ———————————————————————————————————————— Lights ————————————————————————————————————————

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

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
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    onMounted(() => {
      /**
       * Sizes
       */
      sizes = {
        width: outer.value.clientWidth,
        height: outer.value.clientHeight - 100,
      };

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);

      /**
       * Controls
       */
      const controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = true;

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      /**
       * Update
       */
      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        // Update controls
        controls.update();

        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime;
        plane.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = 0.15 * elapsedTime;
        plane.rotation.x = 0.15 * elapsedTime;
        torus.rotation.x = 0.15 * elapsedTime;

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();

      //   const gui = new dat.GUI({ closed: true, width: 400 });
    });

    return {
      canvas,
      outer,
    };
  },
};
</script>

<style lang="scss" scoped>
.exp-outer {
  height: 100%;
  width: 100%;
}
</style>
