<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">
        <el-button
          :type="lightType == 'AmbientLight' ? 'primary' : ''"
          @click="changeLight('AmbientLight')"
        >
          AmbientLight 【环境光】
        </el-button>
        <el-button
          :type="lightType == 'DirectionalLight' ? 'primary' : ''"
          @click="changeLight('DirectionalLight')"
        >
          DirectionalLight 【平行光】
        </el-button>
        <el-button
          :type="lightType == 'HemisphereLight' ? 'primary' : ''"
          @click="changeLight('HemisphereLight')"
        >
          HemisphereLight 【半球光】
        </el-button>
        <el-button
          :type="lightType == 'PointLight' ? 'primary' : ''"
          @click="changeLight('PointLight')"
        >
          PointLight 【点光源】
        </el-button>
        <el-button
          :type="lightType == 'RectAreaLight' ? 'primary' : ''"
          @click="changeLight('RectAreaLight')"
        >
          RectAreaLight 【平面光】
        </el-button>
        <el-button
          :type="lightType == 'SpotLight' ? 'primary' : ''"
          @click="changeLight('SpotLight')"
        >
          SpotLight 【聚光灯】
        </el-button>
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=AmbientLight#api/zh/lights/AmbientLight"
          target="_blank"
          >AmbientLight 环境光介绍</a
        >
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=DirectionalLight#api/zh/lights/DirectionalLight"
          target="_blank"
          >DirectionalLight 平行光介绍</a
        >
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=HemisphereLight#api/zh/lights/HemisphereLight"
          target="_blank"
          >HemisphereLight 半球光介绍</a
        >
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=PointLight#api/zh/lights/PointLight"
          target="_blank"
          >PointLight 点光源介绍</a
        >
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=RectAreaLight#api/zh/lights/RectAreaLight"
          target="_blank"
          >RectAreaLight 平面光介绍</a
        >
      </div>
      <div class="a-link">
        <a
          href="https://threejs.org/docs/index.html?q=SpotLight#api/zh/lights/SpotLight"
          target="_blank"
          >SpotLight 聚光灯介绍</a
        >
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive, defineComponent } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
export default defineComponent({
  name: "",
  setup() {
    const lightType = ref("AmbientLight");
    const lightList = {
      ambientLight: null,

      directionalLight: null,
      directionalLightHelper: null,

      hemisphereLight: null,
      hemisphereLightHelper: null,

      pointLight: null,
      pointLightHelper: null,

      rectAreaLight: null,
      rectAreaLightHelper: null,

      spotLight: null,
      spotLightHelper: null,
    };
    const changeLight = (light) => {
      if (lightType.value == light) return;
      lightType.value = light;
      scene.clear();
      scene.add(sphere, cube, torus, plane);
      scene.add(axesHelper);
      switch (light) {
        case "AmbientLight":
          scene.add(lightList.ambientLight);
          return;
        case "DirectionalLight":
          scene.add(lightList.directionalLight);
          scene.add(lightList.directionalLightHelper);
          return;
        case "HemisphereLight":
          scene.add(lightList.hemisphereLight);
          scene.add(lightList.hemisphereLightHelper);
          return;
        case "PointLight":
          scene.add(lightList.pointLight);
          scene.add(lightList.pointLightHelper);
          return;
        case "RectAreaLight":
          scene.add(lightList.rectAreaLight);
          scene.add(lightList.rectAreaLightHelper);
          return;
        case "SpotLight":
          scene.add(lightList.spotLight);
          scene.add(lightList.spotLight.target);
          scene.add(lightList.spotLightHelper);
          return;
        default:
          return;
      }
    };
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      material
    );
    sphere.position.x = -1.5;

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
      material
    );
    torus.position.x = 1.5;
    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    scene.add(sphere, cube, torus, plane);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ————————————————————————————————————————————————————————————————————————————

    /**
     * Lights
     */
    // Ambient light
    lightList.ambientLight = new THREE.AmbientLight();
    lightList.ambientLight.color = new THREE.Color(0xffffff);
    lightList.ambientLight.intensity = 0.5;
    scene.add(lightList.ambientLight);

    // Directional light
    lightList.directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    lightList.directionalLight.position.set(1, 0.25, 0.5);
    // scene.add(lightList.directionalLight);
    // Helper
    lightList.directionalLightHelper = new THREE.DirectionalLightHelper(
      lightList.directionalLight,
      0.2
    );
    // scene.add(lightList.directionalLightHelper);

    // Hemisphere light
    lightList.hemisphereLight = new THREE.HemisphereLight(
      0xff0000,
      0x0000ff,
      0.3
    );
    // scene.add(lightList.hemisphereLight);
    // Helper
    lightList.hemisphereLightHelper = new THREE.HemisphereLightHelper(
      lightList.hemisphereLight,
      0.2
    );
    // scene.add(lightList.hemisphereLightHelper);

    // Point light
    lightList.pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
    lightList.pointLight.position.set(1, -0.5, 1);
    // scene.add(lightList.pointLight);
    lightList.pointLightHelper = new THREE.PointLightHelper(
      lightList.pointLight,
      0.2
    );
    // scene.add(lightList.pointLightHelper);

    // Rect area light
    lightList.rectAreaLight = new THREE.RectAreaLight(0xffff00, 2, 1, 1);
    lightList.rectAreaLight.position.set(-1.5, 0, 1.5);
    lightList.rectAreaLight.lookAt(new THREE.Vector3());
    // scene.add(lightList.rectAreaLight);
    lightList.rectAreaLightHelper = new RectAreaLightHelper(
      lightList.rectAreaLight
    );
    // scene.add(lightList.rectAreaLightHelper);

    // Spot light
    lightList.spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1
    );
    lightList.spotLight.position.set(0, 2, 3);
    // scene.add(lightList.spotLight);
    lightList.spotLight.target.position.x = -0.75;
    // scene.add(lightList.spotLight.target);
    lightList.spotLightHelper = new THREE.SpotLightHelper(lightList.spotLight);
    // scene.add(lightList.spotLightHelper);

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
        if (lightType.value == "RectAreaLight") {
          lightList.rectAreaLightHelper.position.copy(
            lightList.rectAreaLight.position
          );
          lightList.rectAreaLightHelper.quaternion.copy(
            lightList.rectAreaLight.quaternion
          );
        } else if (lightType.value == "SpotLight") {
          lightList.spotLightHelper.update();
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
      lightType,
      changeLight,
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
.text {
  margin-bottom: 10px;
}
.a-link {
  height: 32px;
  line-height: 32px;
  a {
    text-decoration: none;
  }
}
</style>
