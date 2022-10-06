<template>
    <div ref="outer" id="" class="">
      <canvas ref="canvas" class="webgl"></canvas>
    </div>
  </template>
  
  <script>
  import * as THREE from "three";
  import { ref, onMounted, reactive } from "vue";
  export default {
    name: "",
    setup() {  
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

  
      // AxesHelper
      const axesHelper = new THREE.AxesHelper();
      scene.add(axesHelper);
  
      // ————————————————————————————————————————————————————————————————————————————
  
  
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

      };
    },
  };
  </script>
  
  <style lang="scss" scoped>

  </style>
  