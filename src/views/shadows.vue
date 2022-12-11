<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <h3 class="text">阴影效果</h3>
      <p>
        threejs的阴影效果没那么强大，且细看就容易穿帮。阴影其实是由光源处的shadowMap投射在接收阴影的Object上的。
      </p>
      <p>此外，对于光源固定且自身固定的物体，还可以直接使用贴图阴影。</p>
      <div>
        <el-button type="primary" @click="showShadows('1')"
          >效果展示1 平面光阴影</el-button
        >
        <el-button type="primary" @click="showShadows('2')"
          >效果展示2 灯光阴影</el-button
        >
        <el-button type="primary" @click="showShadows('3')"
          >效果展示3 点光源阴影</el-button
        >
        <el-button type="primary" @click="showShadows('4')"
          >效果展示4 贴图阴影</el-button
        >
        <el-button type="primary" @click="showShadows('5')"
          >效果展示5 贴图阴影2</el-button
        >
      </div>
      <ul>
        常用的四种阴影类型
        <li>THREE.BasicShadowMap 渲染性能 好 ，但是渲染效果 糟糕</li>
        <li>
          THREE.PCFShadowMap 渲染性能 较好 ，渲染效果
          较平滑（样例中全部采用该阴影）
        </li>
        <li>THREE.PCFSoftShadowMap 渲染性 欠佳，但是渲染效果 较好</li>
        <li>THREE.VSMShadowMapp 渲染性 差，且会产生冲突和意外后果</li>
      </ul>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive, defineComponent } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
export default defineComponent({
  name: "",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    let status = ref("1");
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    // ————————————————————————————————————————————————————————————————————————————
    // Shadows

    // 生成平面光源
    const generateDLS = () => {
      gui
        .add(directionalLight, "intensity")
        .min(0)
        .max(1)
        .step(0.001)
        .name("DL Intensity");
      gui
        .add(directionalLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("DL positionX");
      gui
        .add(directionalLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("DL positionY");
      gui
        .add(directionalLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("DL positionZ");

      gui
        .add(directionalLight.shadow, "radius")
        .min(0)
        .max(50)
        .step(1)
        .name("DL shadowRadius");
      scene.add(directionalLight);
      scene.add(directionalLightCameraHelper);
    };
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    // 生成阴影，shadowMap生效
    directionalLight.castShadow = true;

    // 这里是调整shadowMap的生成精度
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    // 调整阴影相机的生效范围（远近）
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;

    directionalLight.shadow.camera.top = 1.5;
    directionalLight.shadow.camera.right = 1.5;
    directionalLight.shadow.camera.bottom = -1.5;
    directionalLight.shadow.camera.left = -1.5;
    // PCFSoftShadowMap中，radius无效
    directionalLight.shadow.radius = 20;

    directionalLight.position.set(2, 2, -1);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalLightCameraHelper.visible = true;

    // 生成聚光灯光源
    const generateSLS = () => {
      gui
        .add(spotLight.shadow.camera, "fov")
        .min(10)
        .max(90)
        .step(1)
        .name("SL fov");
      scene.add(spotLight);
      scene.add(spotLight.target);
      scene.add(spotLightCameraHelper);
    };
    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;

    spotLight.shadow.camera.fov = 30;
    spotLight.position.set(0, 2, 2);

    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera
    );
    spotLightCameraHelper.visible = true;

    // 生成点光源
    const generatePLS = () => {
      scene.add(pointLight);
      scene.add(pointLightCameraHelper);
    };
    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 0.3);

    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;

    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;

    pointLight.position.set(-1, 1, 0);

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera
    );
    pointLightCameraHelper.visible = true;

    // ————————————————————————————————————————————————————————————————————————————
    // Debug
    let gui = null;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const bakedShadow = textureLoader.load(
      "src/assets/textures/shadow/bakedShadow.jpg"
    );
    const simpleShadow = textureLoader.load(
      "src/assets/textures/shadow/simpleShadow.jpg"
    );

    /**
     * Materials
     */
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      material
    );
    // 生成阴影
    sphere.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
    // 接收阴影，阴影生成面
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;

    const sphereShadow1 = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        map: bakedShadow,
      })
    );

    const BakingShadows = () => {
      // 贴图烘焙，关闭自生成阴影
      renderer.shadowMap.enabled = false;

      gui.add(material, "metalness").min(0).max(1).step(0.001);
      gui.add(material, "roughness").min(0).max(1).step(0.001);
      gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

      sphereShadow1.rotation.x = -Math.PI * 0.5;
      sphereShadow1.position.y = plane.position.y + 0.01;
      scene.add(sphereShadow1);
    };

    const sphereShadow2 = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
      })
    );

    const AnimateShadow = () => {
      renderer.shadowMap.enabled = false;

      gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

      sphereShadow2.rotation.x = -Math.PI * 0.5;
      sphereShadow2.position.y = plane.position.y + 0.01;

      scene.add(sphereShadow2);
    };

    // 生成必要的渲染对象
    const generateBasic = () => {
      if (gui) {
        gui.close();
        gui.destroy();
      }
      sphere.position.set(0, 0, 0);
      gui = new dat.GUI();
      scene.add(ambientLight);
      scene.add(sphere, plane);
    };

    generateBasic();
    generateDLS();

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

    // 函数处理

    const showShadows = (type) => {
      status.value = type;
      renderer.shadowMap.enabled = true;
      scene.clear();
      generateBasic();
      switch (type) {
        case "1":
          generateDLS();
          return;
        case "2":
          generateSLS();
          return;
        case "3":
          generatePLS();
          return;
        case "4":
          BakingShadows();
          return;
        case "5":
          AnimateShadow();
          return;
        default:
          return;
      }
    };

    /**
     * Renderer
     */
    let renderer = null;

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
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
      });

      // 允许加载阴影
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap; //

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
      const clock = new THREE.Clock();

      const tick = () => {
        if (status.value == "5") {
          const elapsedTime = clock.getElapsedTime();
          // Update the sphere
          sphere.position.x = Math.cos(elapsedTime) * 1.5;
          sphere.position.z = Math.sin(elapsedTime) * 1.5;
          sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

          // Update the shadow
          sphereShadow2.position.x = sphere.position.x;
          sphereShadow2.position.z = sphere.position.z;
          sphereShadow2.material.opacity =
            (1 - Math.abs(sphere.position.y)) * 0.3;
        }

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
      showShadows,
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
