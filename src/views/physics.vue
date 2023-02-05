<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <h3 class="text">物理引擎</h3>
      <p>
        物理引擎库分为2D和3D，本文中仅讨论3D，目前市面上开源的物理引擎有如下几种：
      </p>
      <p>
        1、Ammo.js：基于著名的物理引擎 Bullet physics
        engine，原为C++实现，作者使用Emscripten重写为JavaScript实现。
      </p>
      <p>2、Physijs：基于Ammo.js的API的封装，做了部分优化。</p>
      <p>
        3、Cannon.js：基于Ammo.js的API的封装，做了部分优化，新库cannon-es支持ES6。
      </p>
      <p>4、Oimo.js：基于OimoPhysics实现。</p>
      <p>本demo使用的是 cannon-es</p>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive, defineComponent } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

export default defineComponent({
  name: "",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    // —————————————————————————————————————— ⭐ ——————————————————————————————————————

    const gui = new dat.GUI();
    // gui对象，自定义对象
    const debugObject = {};

    /**
     * Physics 创建物理引擎
     */
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true; // 允许不再活动的集合体睡眠
    world.gravity.set(0, -9.82, 0); // 设置重力！

    // 物理引擎材料，以及碰撞材料！
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    world.defaultContactMaterial = defaultContactMaterial;

    // ⭐物理引擎 地板 ———————————————————— 可与 threejs 的floor比较
    const floorShape = new CANNON.Plane(); // 几何平面
    const floorBody = new CANNON.Body(); // 物理引擎-体
    floorBody.mass = 0; // 质量为0，无限大
    floorBody.addShape(floorShape); // 几物理引擎-体——何平面
    // 设置方向，并反转
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    world.addBody(floorBody);

    // ⭐ThreeJs 地板！———————————————————— 可与 threejs 的floor比较
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    floor.receiveShadow = true; // 显现阴影
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Sounds
     */
    const hitSound = new Audio("src/assets/sounds/hit.mp3");
    // 播放声音
    const playHitSound = (collision) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
      if (impactStrength > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };

    // 创建球体
    debugObject.createSphere = () => {
      createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    };
    gui.add(debugObject, "createSphere");

    // 创建立方体
    debugObject.createBox = () => {
      createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    };
    gui.add(debugObject, "createBox");

    // 重置场景
    debugObject.reset = () => {
      for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener("collide", playHitSound);
        world.removeBody(object.body);

        // Remove mesh
        scene.remove(object.mesh);
      }
    };
    gui.add(debugObject, "reset");

    // 保存新添加的几何体
    const objectsToUpdate = [];

    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
    });
    // 创建立方体函数
    const createBox = (width, height, depth, position) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh.scale.set(width, height, depth);
      mesh.castShadow = true; // 生成阴影
      mesh.position.copy(position); // 复制位置
      scene.add(mesh);

      // Cannon.js 重新创建了一个几何体，用于进行物理引擎计算
      const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
      );
      // Cannon.js 将 shape 加入 物理引擎 中
      const body = new CANNON.Body({
        mass: 1, // 质量为1
        position: new CANNON.Vec3(0, 3, 0), // 位置
        shape: shape, // 几何模型
        material: defaultMaterial, // 默认材质
      });
      body.position.copy(position);
      body.addEventListener("collide", playHitSound);
      world.addBody(body);

      // 生成的几何体存入对象
      objectsToUpdate.push({ mesh, body });
    };
    createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
    });
    // 创建球体
    const createSphere = (radius, position) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.castShadow = true;
      mesh.scale.set(radius, radius, radius);
      mesh.position.copy(position);
      scene.add(mesh);

      // Cannon.js body
      const shape = new CANNON.Sphere(radius);

      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial,
      });
      body.position.copy(position);
      body.addEventListener("collide", playHitSound);
      world.addBody(body);

      // 生成的几何体存入对象
      objectsToUpdate.push({ mesh, body });
    };

    /**
     * Lights 氛围灯 以及 方向灯
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

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
    camera.position.set(-4, 4, 4);
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
      renderer.shadowMap.enabled = true; // 启动阴影
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 阴影类型
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Controls
       */
      const controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = true;

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        // 物理引擎更新 （ 动画刷新帧，引擎执行时间间隔，引擎执行次数 ）
        world.step(1 / 60, deltaTime, 3);

        for (const object of objectsToUpdate) {
          object.mesh.position.copy(object.body.position);
          object.mesh.quaternion.copy(object.body.quaternion);
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
