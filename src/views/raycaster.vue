<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <h3>光线投射Raycaster</h3>
      <p class="text">
        这个类用于进行raycasting（光线投射）。
        光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
      </p>
      <p>注意点：</p>
      <p>
        1. raycaster设置参数 raycaster.set ( origin : Vector3, direction :
        Vector3 ),第二个Vector3为单位向量，通过 Vector3 的 normalize()
        将该向量转换为单位向量（unit vector）
      </p>
      <p>
        2. 需要 intersectObject 或 intersectObjects
        手动添加射线对穿过物体的检测，即射线是否穿过这个物体
      </p>
      <p>
        3. raycaster.set固定设好了相机，如果加入鼠标追踪，那么可以用
        raycaster.setFromCamera(mouse, camera) 不断的更新投射光线！
      </p>
      <p>
        4.
        设置正确的位置，通过鼠标获得的x,y值，需要进行换算，转换为在canvas画布中，在
        scene 中对于 Axes 正常的值，最简单的调试方法是，观察靠近 Axes
        原点的x,y值是否无限趋近于0, 再进行相应的比例换算处理
      </p>
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
  name: "raycaster",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    const object1 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16), // 球缓冲几何体（SphereBufferGeometry）
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    object1.position.x = -2;

    const object2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );

    const object3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // ——————————————————————————————————————⭐——————————————————————————————————————
    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster(); // 创建
    let currentIntersect = null;
    const rayOrigin = new THREE.Vector3(-3, 0, 0); // 起点
    const rayDirection = new THREE.Vector3(10, 0, 0); // 方向
    rayDirection.normalize(); // 通过 normalize() 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。

    // raycaster.set(rayOrigin, rayDirection)
    // raycaster.set ( origin : Vector3, direction : Vector3 ) : undefined
    // origin —— 光线投射的原点向量。
    // direction —— 为光线提供方向的标准化方向向量。

    /**
     * Mouse
     */
    const mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      mouse.x = ((event.clientX - 402) / sizes.width) * 2 - 1;
      mouse.y = -((event.clientY - 300) / sizes.height) * 2 + 1;
    });

    window.addEventListener("click", () => {
      if (currentIntersect) {
        switch (currentIntersect.object) {
          case object1:
            console.log("click on object 1");
            break;

          case object2:
            console.log("click on object 2");
            break;

          case object3:
            console.log("click on object 3");
            break;
        }
      }
    });

    // ————————————————————————————————————————————————————————————————————————————
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

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Animate objects
        object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
        object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
        object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

        // Cast a ray from the mouse and handle events
        // raycaster.setFromCamera(mouse, camera);
        // 使用一个新的原点和方向来更新射线。
        // .setFromCamera ( coords : Vector2, camera : Camera ) : undefined
        // coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
        // camera —— 射线所来源的摄像机。

        const objectsToTest = [object1, object2, object3];
        const intersects = raycaster.intersectObjects(objectsToTest);

        // 检测所有在射线与这些物体之间，包括或不包括后代的相交部分。返回结果时，相交部分将按距离进行排序，最近的位于第一个），相交部分和.intersectObject所返回的格式是相同的。
        // .intersectObjects ( objects : Array, recursive : Boolean, optionalTarget : Array ) : Array
        // objects —— 检测和射线相交的一组物体。
        // recursive —— 若为true，则同时也会检测所有物体的后代。否则将只会检测对象本身的相交部分。默认值为true。
        // optionalTarget —— （可选）设置结果的目标数组。如果不设置这个值，则一个新的Array会被实例化；如果设置了这个值，则在每次调用之前必须清空这个数组（例如：array.length = 0;）。

        // ⭐ 固定 光线投射 使用 raycaster.set(rayOrigin, rayDirection),光线穿过圆球时，圆球变色
        // raycaster.set(rayOrigin, rayDirection)
        // for(const object of objectsToTest)
        // {
        //     object.material.color.set('#ff0000')
        // }
        // for(const intersect of intersects)
        // {
        //     intersect.object.material.color.set('#0000ff')
        // }

        // ⭐ 鼠标追踪 原点为鼠标，方向为摄像机，实时刷新
        raycaster.setFromCamera(mouse, camera);
        for (const intersect of intersects) {
          intersect.object.material.color.set("#0000ff");
        }
        for (const object of objectsToTest) {
          if (!intersects.find((intersect) => intersect.object === object)) {
            object.material.color.set("#ff0000");
          }
        }

        // if (intersects.length) {
        //   if (!currentIntersect) {
        //     console.log("mouse enter");
        //   }
        //   currentIntersect = intersects[0];
        // } else {
        //   if (currentIntersect) {
        //     console.log("mouse leave");
        //   }

        //   currentIntersect = null;
        // }

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
