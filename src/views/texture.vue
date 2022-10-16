<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <div class="text">
        <h3>纹理的设置</h3>
        <p>设置纹理有三种方法</p>
        <p>
          &nbsp;&nbsp; 1.新建 new Image() 图片实例，再建立 texture = new
          THREE.Texture(image) 实例，监听 image 的 load 事件触发更新
          textures.needsUpdate = true
        </p>
        <p>
          &nbsp;&nbsp; 2.新建 new THREE.TextureLoader()
          纹理加载器，材质由加载器加载 textures = textureLoader.load( url,
          onLoadCallback, onProcessCallback, onErrorCallback ),
        </p>
        <p>
          &nbsp;&nbsp; 3.新建 loadingManager = new THREE.LoadingManager()
          纹理管理器，再使用 new THREE.TextureLoader( loadingManager ),
          loadingManager的作用是分理出对材质加载时的处理，暴露出四个回调
          loadingManager.onStart=()=>{}
        </p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;loadingManager.onStart=()=>{}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;loadingManager.onLoad=()=>{}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;loadingManager.onProgress=()=>{}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;loadingManager.onError=()=>{}</p>
        <h3>其他关于纹理的设置，仅列出api</h3>
        <p>
          &nbsp;&nbsp;colorTexture.repeat.x/y
          控制纹理贴图x/y方向的重复排布。设置等于1，则纹理不会重复；设置为
          大于0小于1 的值，纹理会被放大； 设置为 小于0
          的值，那么会产生纹理的镜像； 设置为 大于1 的值，纹理会重复平铺。
        </p>
        <p>
          &nbsp;&nbsp;colorTexture.wrapS/wrapT
          纹理在水平/垂直方向上纹理包裹方式，在UV映射中对应于U，默认THREE.ClampToEdgeWrapping，表示纹理边缘与网格的边缘贴合。中间部分等比缩放。还可以设置为：THREE.RepeatWrapping(重复平铺)
          和 THREE.MirroredRepeatWrapping（先镜像再重复平铺）
        </p>
        <p>
          &nbsp;&nbsp;colorTexture.offset/center.x/y，colorTexture.rotation等
        </p>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
export default {
  name: "Texture",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ————————————————————————————————————————————————————————————————————————————
    /**
     * Texture
     */
    // ————————————————————————————————————————————————————————————————————————————————————————
    // 方法1
    // const image = new Image();
    // const textures = new THREE.Texture(image);
    // image.addEventListener("load", () => {
    //   textures.needsUpdate = true;
    // });
    // image.src = "/textures/door/color.jpg";

    // 方法2
    // const textureLoader = new THREE.TextureLoader();
    // const textures = textureLoader.load(
    //   "/textures/door/color.jpg",
    //   () => {
    //     console.log("onLoad");
    //   },
    //   () => {
    //     console.log("onProcess");
    //   },
    //   () => {
    //     console.log("onError");
    //   }
    // );
    // 方法3
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      console.log("onStart");
    };
    loadingManager.onLoad = () => {
      console.log("onLoad");
    };
    loadingManager.onProgress = () => {
      console.log("onProgress");
    };
    loadingManager.onError = () => {
      console.log("onError");
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);
    // const colorTexture = textureLoader.load("src/assets/textures/door/color.jpg");
    // const colorTexture = textureLoader.load('src/assets/textures/checkerboard-1024x1024.png')
    const colorTexture = textureLoader.load(
      "src/assets/textures/checkerboard-8x8.png"
    );
    // const colorTexture = textureLoader.load(
    //   "src/assets/textures/minecraft.png"
    // );
    const alphaTexture = textureLoader.load(
      "src/assets/textures/door/alpha.jpg"
    );
    const heightTexture = textureLoader.load(
      "src/assets/textures/door/height.jpg"
    );
    const normalTexture = textureLoader.load(
      "src/assets/textures/door/normal.jpg"
    );
    const ambientOcclusionTexture = textureLoader.load(
      "src/assets/textures/door/ambientOcclusion.jpg"
    );
    const metalnessTexture = textureLoader.load(
      "src/assets/textures/door/metalness.jpg"
    );
    const roughnessTexture = textureLoader.load(
      "src/assets/textures/door/roughness.jpg"
    );
    // 设置重复数量
    colorTexture.repeat.x = 1;
    colorTexture.repeat.y = 1;
    // 启动重复缠绕

    colorTexture.wrapS = THREE.ClampToEdgeWrapping; // ClampToEdgeWrapping
    colorTexture.wrapT = THREE.ClampToEdgeWrapping; // THREE.RepeatWrapping

    colorTexture.offset.x = 0;
    colorTexture.offset.y = 0;
    colorTexture.rotation = 0; // Math.PI * 0.25
    colorTexture.center.x = 0;
    colorTexture.center.y = 0;
    // colorTexture.center.set(0.5, 0.5);

    /**
     * Minification filter
     */
    // ————————————————————————————————————————————————————————————————————————————————————————

    // THREE.NearestFilter — 临近过滤：放大会导致方块化，缩小会丢失细节
    // colorTexture.minFilter = THREE.NearestFilter;

    // THREE.LinearFilter — 线性过滤：放大会平滑很多
    // colorTexture.minFilter = THREE.LinearFilter;

    // THREE.NearestMipMapNearestFilter — 选择最贴近目标解析度的纹理图片，然后使用最邻近过滤原则
    // colorTexture.minFilter = THREE.NearestMipmapNearestFilter;

    // THREE.NearestMipMapLinearFilter — 选择层次最近的两个纹理图片，在这两层之间使用最邻近过滤原则获取两个中间值，将这两个中间值传递给线性过滤器，以获得最终效果
    // colorTexture.minFilter = THREE.NearestMipmapLinearFilter;

    // THREE.LinearMipMapNearestFilter — 选择最贴近目标解析度的纹理图片，然后使用线性过滤原则
    // colorTexture.minFilter = THREE.LinearMipmapNearestFilter;

    // THREE.LinearMipMapLinearFilter — 选择层次最近的两个纹理图片，在这两层之间使用线性过滤原则获得两个中间值，将这两个中间值传递给线性过滤器，以获得最终结果
    // colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
    // ————————————————————————————————————————————————————————————————————————————————————————

    /**
     * Minification filter
     */
    // ————————————————————————————————————————————————————————————————————————————————————————
    // THREE.NearestFilter开销较小，不使用mipmaps时，可关闭
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter; // 此时mipmaps已关闭，设置也没用
    colorTexture.magFilter = THREE.NearestFilter;
    // colorTexture.magFilter = THREE.LinearFilter
    // ————————————————————————————————————————————————————————————————————————————————————————
    /**
     * UV unwrapping
     */
    // ————————————————————————————————————————————————————————————————————————————————————————

    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    // const geometry = new THREE.ConeGeometry(1, 1, 32);
    // const geometry = new THREE.TorusGeometry(1, 0.35, 32,100);
    console.log("uv==>", geometry.attributes.uv);

    // ————————————————————————————————————————————————————————————————————————————

    /**
     * Object
     */
    let mesh = null;
    const material = new THREE.MeshBasicMaterial({ map: colorTexture });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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
        width: outer.value.clientWidth - 200,
        height: outer.value.clientHeight - 550,
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

      const gui = new dat.GUI({ closed: true, width: 400 });
      gui
        .add(mesh.material.map.repeat, "x")
        .min(-3)
        .max(3)
        .step(0.1)
        .name("repeatX");
      gui
        .add(mesh.material.map.repeat, "y")
        .min(-3)
        .max(3)
        .step(0.1)
        .name("repeatY");
      gui
        .add(mesh.material.map, "rotation")
        .min(-3)
        .max(3)
        .step(0.1)
        .name("rotation");
      gui
        .add(mesh.material.map.offset, "x")
        .min(-2)
        .max(2)
        .step(0.1)
        .name("offsetX");
      gui
        .add(mesh.material.map.offset, "y")
        .min(-2)
        .max(2)
        .step(0.1)
        .name("offsetY");
      gui
        .add(mesh.material.map.center, "x")
        .min(-2)
        .max(2)
        .step(0.1)
        .name("centerX");
      gui
        .add(mesh.material.map.center, "y")
        .min(-2)
        .max(2)
        .step(0.1)
        .name("centerY");
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
  .content {
    height: 550px;
    padding: 20px;
    h3,
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
