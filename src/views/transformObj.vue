<template>
  <div ref="outer" id="transformObj" class="transform-obj">
    <div class="control-bar">
      <div class="yellow">
        <h3 style="color: yellow; margin-bottom: 20px">
          Yellow Position Control
        </h3>
        <div>
          <span> Position X</span>
          <el-slider
            v-model="yellow.x"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="yellowController($event, 'x')"
          />
        </div>
        <div>
          <span> Position Y</span>
          <el-slider
            v-model="yellow.y"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="yellowController($event, 'y')"
          />
        </div>
        <div>
          <span> Position Z</span>
          <el-slider
            v-model="yellow.z"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="yellowController($event, 'z')"
          />
        </div>
      </div>
      <div class="green">
        <h3 style="color: green; margin-bottom: 20px">Green Rotate Control</h3>
        <div>
          <span> Rotation X</span>
          <el-slider
            v-model="green.x"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="greenController($event, 'x')"
          />
        </div>
        <div>
          <span> Rotation Y</span>
          <el-slider
            v-model="green.y"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="greenController($event, 'y')"
          />
        </div>
        <div>
          <span> Rotation Z</span>
          <el-slider
            v-model="green.z"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="greenController($event, 'z')"
          />
        </div>
      </div>
      <div class="red">
        <h3 style="color: red">Red Control</h3>
        <div>
          <span> Scale X</span>
          <el-slider
            v-model="red.x"
            show-input
            :min="0.5"
            :max="10"
            :step="0.1"
            @input="redController($event, 'x')"
          />
        </div>
        <div>
          <span> Scale Y</span>
          <el-slider
            v-model="red.y"
            show-input
            :min="0.5"
            :max="10"
            :step="0.1"
            @input="redController($event, 'y')"
          />
        </div>
        <div>
          <span> Scale Z</span>
          <el-slider
            v-model="red.z"
            show-input
            :min="0.5"
            :max="10"
            :step="0.1"
            @input="redController($event, 'z')"
          />
        </div>
      </div>
      <div class="total">
        <h3>Total Control</h3>
        <div>
          <span> Position Z</span>
          <el-slider
            v-model="total.positionZ"
            show-input
            :min="0.5"
            :max="10"
            :step="0.1"
            @input="totalController($event, 'positionZ')"
          />
        </div>
        <div>
          <span> Position Y</span>
          <el-slider
            v-model="total.positionY"
            show-input
            :min="-3"
            :max="3"
            :step="0.1"
            @input="totalController($event, 'positionY')"
          />
        </div>
        <div>
          <span> Rotate Z</span>
          <el-slider
            v-model="total.rotateZ"
            show-input
            :min="-5"
            :max="5"
            :step="0.1"
            @input="totalController($event, 'rotateZ')"
          />
        </div>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
export default {
  name: "TransformObj",
  setup() {
    const outer = ref(null);

    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.MeshBasicMaterial({
        color: "red",
        opacity: 0.5,
        transparent: true,
      })
    );
    cube1.position.x = 2;
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "lime", wireframe: true })
    );
    group.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.MeshBasicMaterial({
        color: "yellow",
      })
    );
    cube3.position.x = -2;
    group.add(cube3);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ————————————————————————————————————————————————————————————————————————————

    // yellow control
    const yellow = reactive({
      x: -2,
      y: 0,
      z: 0,
    });

    const yellowController = (value, position) => {
      // console.log("value==", value);
      // console.log("position==", position);
      switch (position) {
        case "x":
          yellow.x = +value.toFixed(2);
          return (cube3.position.x = yellow.x);
        case "y":
          yellow.y = +value.toFixed(2);
          return (cube3.position.y = yellow.y);
        case "z":
          yellow.z = +value.toFixed(2);
          return (cube3.position.z = yellow.z);
      }
    };

    // green control
    const green = reactive({
      x: 0,
      y: 0,
      z: 0,
    });
    const greenController = (value, position) => {
      switch (position) {
        case "x":
          green.x = +value.toFixed(2);
          return (cube2.rotation.x = green.x);
        case "y":
          green.y = +value.toFixed(2);
          return (cube2.rotation.y = green.y);
        case "z":
          green.z = +value.toFixed(2);
          return (cube2.rotation.z = green.z);
      }
    };

    // red control
    const red = reactive({
      x: 1,
      y: 1,
      z: 1,
    });
    const redController = (value, position) => {
      switch (position) {
        case "x":
          red.x = +value.toFixed(2);
          return (cube1.scale.x = red.x);
        case "y":
          red.y = +value.toFixed(2);
          return (cube1.scale.y = red.y);
        case "z":
          red.z = +value.toFixed(2);
          return (cube1.scale.z = red.z);
      }
    };

    // total control
    const total = reactive({
      positionZ: 5,
      positionY: 1,
      rotateZ: 0,
    });
    const totalController = (value, position) => {
      switch (position) {
        case "positionZ":
          total.positionZ = +value.toFixed(2);
          return (camera.position.z = total.positionZ);
        case "positionY":
          total.positionY = +value.toFixed(2);
          return (camera.position.y = total.positionY);
        case "rotateZ":
          total.rotateZ = +value.toFixed(2);
          return (camera.rotation.z = total.rotateZ);
      }
    };

    // ————————————————————————————————————————————————————————————————————————————
    const sizes = {
      width: 800,
      height: 500,
    };

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.set(0, 1, 5);

    // camera.lookAt(mesh.position);
    scene.add(camera);

    onMounted(() => {
      /**
       * Sizes
       */
      const sizes = {
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
       * Update
       */
      const tick = () => {
        // Update controls
        // controls.update();

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
      yellowController,
      yellow,
      greenController,
      green,
      redController,
      red,
      totalController,
      total,
    };
  },
};
</script>

<style lang="scss" scoped>
.transform-obj {
  height: 100%;
  width: 100%;
  .control-bar {
    height: 300px;
    display: flex;
    .yellow,
    .green,
    .red,
    .total {
      flex: 1;
      padding-right: 50px;
      div {
        margin: 10px 0;
      }
    }
  }
  .webgl {
    background-color: bisque;
  }
}
</style>
