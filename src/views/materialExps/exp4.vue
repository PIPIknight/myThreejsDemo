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
    // MeshStandardMaterial 一种基于物理的标准材质，使用Metallic-Roughness工作流程。
    // 基于物理的渲染（PBR）最近已成为许多3D应用程序的标准，例如Unity， Unreal和 3D Studio Max。
    const material1 = new THREE.MeshStandardMaterial();
    material1.roughness = 0.5;
    material1.metalness = 0.5;

    // MeshNormalMaterial 法线网格材质 一种把法向量映射到RGB颜色的材质
    const material2 = new THREE.MeshNormalMaterial();
    material2.flatShading = true;

    // MeshMatcapMaterial 由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，其编码了材质的颜色与明暗。
    // 由于mapcap图像文件编码了烘焙过的光照，因此MeshMatcapMaterial 不对灯光作出反应。 它将会投射阴影到一个接受阴影的物体上(and shadow clipping works)，但不会产生自身阴影或是接受阴影。
    const material3 = new THREE.MeshMatcapMaterial();
    // const matcapTexture = textureLoader.load("src/assets/textures/matcaps/2.png");
    // const matcapTexture = textureLoader.load('src/assets/textures/matcaps/3.png')
    // const matcapTexture = textureLoader.load('src/assets/textures/matcaps/4.png')
    const matcapTexture = textureLoader.load(
      "src/assets/textures/matcaps/5.png"
    );
    // const matcapTexture = textureLoader.load('src/assets/textures/matcaps/6.png')
    // const matcapTexture = textureLoader.load('src/assets/textures/matcaps/7.png')
    // const matcapTexture = textureLoader.load('src/assets/textures/matcaps/8.png')
    material3.matcap = matcapTexture;

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
      const clock = new THREE.Clock();

      /**
       * Update
       */
      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        // Update controls
        controls.update();

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
