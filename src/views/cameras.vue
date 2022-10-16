<template>
  <div ref="outer" id="camera-area" class="camera-area">
    <div class="camera-content">
      <div class="camera-text">
        <h3>透视相机（PerspectiveCamera）</h3>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp; 这一摄像机使用perspective
          projection（透视投影）来进行投影。用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。
        </p>
        <h3>正交相机（OrthographicCamera）</h3>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;这一摄像机使用orthographic
          projection（正交投影）来进行投影。
          在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong
            >这对于渲染2D场景或者UI元素是非常有用的。</strong
          >
        </p>
        <h3>轨道控制器（OrbitControls）</h3>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;Orbit
          controls（轨道控制器）可以使得相机围绕目标进行轨道运动。比较在
          PerspectiveCamera 和 OrthographicCamera下使用轨道控制器。
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;OrbitControls的核心是update(),需要放置在动画函数中同步调用！enableDamping设为true，添加变化延迟，使得变化更加顺滑。
        </p>
      </div>
      <div class="camera-control">
        <el-button type="primary" class="buttons" @click="openPcamera">
          切换至 透视相机（PerspectiveCamera）
        </el-button>
        <el-button type="primary" class="buttons" @click="openOcamera">
          切换至 正交相机（OrthographicCamera
        </el-button>
        <el-button type="primary" class="buttons" @click="toggleEnableDamping">
          enableDamping {{ isTrue ? " 关闭" : " 开启" }}
        </el-button>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "Cameras",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(mesh);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ————————————————————————————————————————————————————————————————————————————

    /**
     * Cursor
     */
    const cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = -(e.clientY / sizes.height - 0.5);
    });

    // ————————————————————————————————————————————————————————————————————————————
    let sizes = {
      width: 800,
      height: 500,
    };

    /**
     * Camera
     */
    let camera = null;

    /**
     * Controls
     */
    let controls = null;

    const outer = ref();

    const isTrue = ref(true);

    const openPcamera = () => {
      scene.remove(camera);
      console.log("openPcamera");
      camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      camera.position.set(0, 1, 5);
      scene.add(camera);
      //   摄像机变化重新挂载controls
      controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = isTrue.value;
    };

    const openOcamera = () => {
      scene.remove(camera);
      console.log("openOcamera");
      // OrthographicCamera
      const aspectRatio = sizes.width / sizes.height;
      camera = new THREE.OrthographicCamera(
        -1 * aspectRatio,
        1 * aspectRatio,
        1,
        -1,
        0.1,
        100
      );
      camera.position.x = 5;
      camera.position.y = 5;
      camera.position.z = 5;
      camera.lookAt(mesh.position);
      scene.add(camera);
      // 摄像机变化重新挂载controls
      controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = isTrue.value;
    };

    const toggleEnableDamping = () => {
      isTrue.value = !isTrue.value;
      console.log(isTrue.value);
      controls.enableDamping = isTrue.value;
    };

    onMounted(() => {
      /**
       * Sizes
       */
      sizes = {
        width: outer.value.clientWidth,
        height: outer.value.clientHeight - 400,
      };

      // PerspectiveCamera
      camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      camera.position.set(0, 1, 5);
      scene.add(camera);

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.render(scene, camera);

      controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = isTrue.value;

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
      isTrue,
      openPcamera,
      openOcamera,
      toggleEnableDamping,
    };
  },
};
</script>

<style lang="scss" scoped>
.camera-area {
  height: 100%;
  width: 100%;
  background-color: #fff;
  font-size: 16px;
  .camera-content {
    display: flex;
    height: 400px;
    padding: 20px;
    .camera-text {
      flex: 3;
      h3,
      p,
      span {
        margin-bottom: 20px;
        line-height: 22px;
      }
    }
    .camera-control {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 20px;
      .buttons {
        margin: 20px 0;
      }
    }
  }
}
</style>
