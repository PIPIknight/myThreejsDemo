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
    const gradientTexture = textureLoader.load(
      "src/assets/textures/gradients/5.jpg"
    );
    // MeshLambertMaterial 一种非光泽表面的材质，没有镜面高光。
    // 该材质使用基于非物理的Lambertian模型来计算反射率。 这可以很好地模拟一些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。
    const material1 = new THREE.MeshLambertMaterial();

    // MeshPhongMaterial 一种用于具有镜面高光的光泽表面的材质。
    // 该材质使用非物理的Blinn-Phong模型来计算反射率。 与MeshLambertMaterial中使用的Lambertian模型不同，该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。
    const material2 = new THREE.MeshPhongMaterial();
    material2.shininess = 100;
    material2.specular = new THREE.Color(0x1188ff);

    // MeshToonMaterial 卡通网格材质
    const material3 = new THREE.MeshToonMaterial();
    // // 卡通着色的渐变贴图，默认值为null
    material3.gradientMap = gradientTexture;
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;

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
    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

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
       * Animate
       */
    //   const clock = new THREE.Clock();

      /**
       * Update
       */
      const tick = () => {
        // const elapsedTime = clock.getElapsedTime();
        // Update controls
        controls.update();

        // Update objects
        // sphere.rotation.y = 0.1 * elapsedTime;
        // plane.rotation.y = 0.1 * elapsedTime;
        // torus.rotation.y = 0.1 * elapsedTime;

        // sphere.rotation.x = 0.15 * elapsedTime;
        // plane.rotation.x = 0.15 * elapsedTime;
        // torus.rotation.x = 0.15 * elapsedTime;

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
