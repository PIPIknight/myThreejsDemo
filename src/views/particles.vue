<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <h3 class="text">粒子效果</h3>
      <p>PointsMaterial 点（Points）使用的默认材质</p>
      <div>
        <el-button @click="stars">星环</el-button>
        <el-button @click="starWave">七彩星空波浪</el-button>
        <el-button @click="snow">下雪</el-button>
      </div>
    </div>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, onMounted, reactive, defineComponent } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default defineComponent({
  name: "",
  setup() {
    let effect = ref("none");

    const stars = () => {
      effect.value = "none";
      scene.clear();

      let angle = Math.random() * Math.PI * 2; // Random angle
      let radius = 3 + Math.random() * 5; // Random radius
      for (let i = 0; i < count * 3; i++) {
        if (i % 3 == 1) {
          positions[i] = 0;
        } else if (i % 3 == 2) {
          positions[i] = Math.sin(angle) * radius;
        } else if (i % 3 == 0) {
          angle = Math.random() * Math.PI * 2;
          radius = 3 + Math.random() * 5;
          positions[i] = Math.cos(angle) * radius;
        }
        colors[i] = 255;
      }

      particlesMaterial.alphaMap = particleTexture;

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      scene.add(particles);
      scene.add(camera);
    };

    const starWave = () => {
      effect.value = "wave";

      scene.clear();

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 8;
        colors[i] = Math.random();
      }

      particlesMaterial.alphaMap = particleTexture;

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      scene.add(particles);
      scene.add(camera);
    };

    const snow = () => {
      effect.value = "snow";
      scene.clear();

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 8;
        colors[i] = 255;
      }

      particlesMaterial.alphaMap = snowTexture;

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      scene.add(particles);
      scene.add(camera);
    };
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

    const particleTexture = textureLoader.load(
      "src/assets/textures/particles/8.png"
    );
    const snowTexture = textureLoader.load(
      "src/assets/textures/particles/3.png"
    );

    /**
     * Objects
     */
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 10000;

    let positions = new Float32Array(count * 3); // x y z | x y z | ……
    let colors = new Float32Array(count * 3); // r g b | r g b | ……

    // particlesGeometry.setAttribute(
    //   "position",
    //   new THREE.BufferAttribute(positions, 3)
    // );
    // particlesGeometry.setAttribute(
    //   "color",
    //   new THREE.BufferAttribute(colors, 3)
    // );

    // Material
    const particlesMaterial = new THREE.PointsMaterial();

    particlesMaterial.size = 0.2;
    particlesMaterial.sizeAttenuation = true;

    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particleTexture;
    // particlesMaterial.alphaTest = 0.01
    // particlesMaterial.depthTest = false
    particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending;

    particlesMaterial.vertexColors = true;

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

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
    camera.position.z = 8;
    camera.position.y = 2;
    scene.add(camera);

    stars();

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
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        if (effect.value != "none") {
          // Update particles
          for (let i = 0; i < count; i++) {
            let i3 = i * 3;
            if (effect.value == "wave") {
              const x = particlesGeometry.attributes.position.array[i3];
              particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
                elapsedTime + x
              );
            } else if (effect.value == "snow") {
              if (particlesGeometry.attributes.position.array[i3 + 1] <= -4) {
                particlesGeometry.attributes.position.array[i3 + 1] = 4;
              } else {
                particlesGeometry.attributes.position.array[i3 + 1] -= 0.01;
              }
            }

            particlesGeometry.attributes.position.needsUpdate = true;
          }
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
      stars,
      starWave,
      snow,
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
