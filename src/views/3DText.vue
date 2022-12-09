<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">3D文字</div>
      <br />
      <div class="ipt-bar">
        <span style="margin-right: 20px">请输入文字: </span>
        <el-input class="text-ipt" maxlength="10" v-model="textIpt"></el-input>
        <el-button type="primary" @click="confirmChange">确认</el-button>
        <el-button type="primary" @click="toggleWireframe"
          >网格化切换</el-button
        >
      </div>
      <div class="ipt-bar">
        <span style="margin-right: 20px">边缘形状数量: </span>
        <!-- <el-input class="text-ipt" maxlength="10" v-model="textIpt"></el-input> -->
        <el-input-number v-model="num" :step="1" :max="500" />
        <el-button type="primary" @click="confirmChange">确认</el-button>
      </div>
      <div class="ipt-bar">
        <span style="margin-right: 20px">发散半径: </span>
        <!-- <el-input class="text-ipt" maxlength="10" v-model="textIpt"></el-input> -->
        <el-input-number v-model="radius" :step="1" :max="20" />
        <el-button type="primary" @click="confirmChange">确认</el-button>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

export default {
  name: "",
  setup() {
    let textIpt = ref("UDS BEST !");
    let wireframeBool = ref(false);
    let num = ref(100);
    let radius = ref(10);
    const confirmChange = () => {
      scene.clear();
      loadText();
    };
    const toggleWireframe = () => {
      wireframeBool.value = !wireframeBool.value;
      scene.clear();
      loadText();
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
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const mesh = new THREE.Mesh(geometry, material);

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(
      "src/assets/textures/matcaps/8.png"
    );

    /**
     * Fonts
     */
    const fontLoader = new FontLoader();

    const loadText = () => {
      fontLoader.load(
        "src/assets/fonts/helvetiker_regular.typeface.json",
        (font) => {
          let material = null;
          if (wireframeBool.value) {
            material = new THREE.MeshBasicMaterial({ wireframe: true });
          } else {
            // Material
            material = new THREE.MeshMatcapMaterial({
              matcap: matcapTexture,
            });
          }

          // const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })

          // Text
          console.log("textIpt.value==", textIpt.value);
          // 文本缓冲几何体
          const textGeometry = new TextGeometry(textIpt.value, {
            font: font, // THREE.Font的实例
            size: 0.5, // Float。 字体大小，默认值为100
            height: 0.2, //  Float。挤出文本的厚度。默认值为50
            curveSegments: 12, //  Integer。（表示文本的）曲线上点的数量。默认值为12。
            bevelEnabled: true, // Boolean。是否开启斜角，默认为false。
            bevelThickness: 0.03, // Float。文本上斜角的深度，默认值为20。
            bevelSize: 0.02, // Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
            bevelOffset: 0, //
            bevelSegments: 5, //  Integer。斜角的分段数。默认值为3。
          });

          textGeometry.center();

          // 几何体方法 .computeBoundingBox()
          // 几何体Geometry调用Box3的方法.setFromPoints()封装了一个方法.computeBoundingBox()，用来计算几何体的包围盒属性.boundingBox。
          // 几何体包围盒属性.boundingBox默认值为空null，执行.computeBoundingBox()方法才会计算该几何体的包围盒Box3，然后赋值给.boundingBox属性。
          // 几何体包围球属性.boundingSphere使用方式和包围盒属性.boundingBox一样。

          textGeometry.computeBoundingBox();
          console.log(textGeometry.boundingBox);

          const text = new THREE.Mesh(textGeometry, material);
          scene.add(text);

          // Donuts
          const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64);

          for (let i = 0; i < num.value; i++) {
            const donut = new THREE.Mesh(donutGeometry, material);
            donut.position.x = (Math.random() - 0.5) * radius.value;
            donut.position.y = (Math.random() - 0.5) * radius.value;
            donut.position.z = (Math.random() - 0.5) * radius.value;
            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;
            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            scene.add(donut);
          }
        }
      );
    };

    loadText();

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
      textIpt,
      wireframeBool,
      num,
      radius,
      confirmChange,
      toggleWireframe,
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
    background-color: #fff;
    .ipt-bar {
      display: flex;
      margin-bottom: 20px;
      .text-ipt {
        width: 300px;
      }
    }
    h3,
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
