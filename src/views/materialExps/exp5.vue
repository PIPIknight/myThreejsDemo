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
    const group = new THREE.Group();
    scene.add(group);

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

    // MeshDepthMaterial 一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远。
    const material1 = new THREE.MeshDepthMaterial();

    const material2 = new THREE.MeshBasicMaterial();
    material2.map = doorColorTexture;
    // 材料有两个面，side默认THREE.FrontSide可见，THREE.BackSide不可见，设置THREE.DoubleSide两面都可见
    material2.side = THREE.DoubleSide;

    const material3 = new THREE.MeshBasicMaterial();
    // 透明度，先得开启transparent
    material3.transparent = true;
    material3.opacity = 0.5;
    // alphaMap - 灰度贴图,控制表面的不透明度
    material3.alphaMap = doorAlphaTexture;

    /**
     * Objects
     */

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      material1
    );
    sphere.position.x = -1.5;

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 100, 100),
      material2
    );

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
      material3
    );
    // const torus = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    //   material3
    // );
    torus.position.x = 1.5;

    group.add(sphere, plane, torus);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    /**
     * Lights Material
     */
    // ———————————————————————————————————————— Lights ————————————————————————————————————————

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 0;
    pointLight.position.y = 0;
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
.exp-outer {
  height: 100%;
  width: 100%;
}
</style>
