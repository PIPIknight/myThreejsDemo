<template>
  <div ref="outer" id="outer" class="outer">
    <div class="content">
      <h3>仅作展示，详情请查阅相关文档</h3>
      <div class="text">
        <el-button @click="changeGeometry(1)">
          正方体 BoxBufferGeometry
        </el-button>
        <el-button @click="changeGeometry(2)"> 球体 SphereGeometry </el-button>
        <!-- <el-button @click="changeGeometry(3)" disabled>
          两个面 Geometry
        </el-button>
        <el-button @click="changeGeometry(4)" disabled>
          很多面 Geometry
        </el-button> -->
        <el-button @click="changeGeometry(5)">
          一个面 BufferGeometry
        </el-button>
        <el-button @click="changeGeometry(6)">
          很多面 BufferGeometry
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
  name: "",
  setup() {
    // ————————————————————————————————————————————————————————————————————————————
    // Canvas
    const canvas = ref(null);
    const outer = ref(null);

    // Scene
    const scene = new THREE.Scene();

    let obj = null;

    /**
     * Objects
     */
    obj = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: "yellow",
        wireframe: true,
      })
    );
    scene.add(obj);

    const box = () => {
      return new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2),
        new THREE.MeshBasicMaterial({
          color: "red",
          wireframe: true,
        })
      );
    };

    const shpere = () => {
      return new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({
          color: "yellow",
          wireframe: true,
        })
      );
    };

    // const face = () => {
    //   const geometry = new THREE.Geometry();

    //   // 设置顶顶坐标及颜色
    //   const vertex1 = new THREE.Vector3(0, 0, 0);
    //   const color1 = new THREE.Color("red");

    //   const vertex2 = new THREE.Vector3(0, 1.5, 0);
    //   const color2 = new THREE.Color("green");

    //   const vertex3 = new THREE.Vector3(0, 0, 1);
    //   const color3 = new THREE.Color("blue");

    //   const vertex4 = new THREE.Vector3(2, 0, 0);
    //   const color4 = new THREE.Color("white");

    //   geometry.vertices.push(vertex1, vertex2, vertex3, vertex4);
    //   geometry.colors.push(color1, color2, color3, color4);

    //   // 选取0，1，2三点为顶点创建面
    //   const face1 = new THREE.Face3(0, 1, 2);
    //   // 设置face1每个顶点的法向量
    //   var n1 = new THREE.Vector3(0, 0, -1);
    //   var n2 = new THREE.Vector3(0, 0, -1);
    //   var n3 = new THREE.Vector3(0, 0, -1);
    //   // 设置face1面三个顶点的法向量
    //   face1.vertexNormals.push(n1, n2, n3);

    //   // 构造另一面
    //   const face2 = new THREE.Face3(0, 2, 3);
    //   // 设置face2面的法向量
    //   face2.normal = new THREE.Vector3(0, -1, 0);

    //   geometry.faces.push(face1, face2);

    //   const material = new THREE.MeshBasicMaterial({
    //     color: "blue",
    //   });

    //   return new THREE.Mesh(geometry, material);
    // };

    // const faces = () => {
    //   const geometry = new THREE.BufferGeometry();
    //   for (let i = 0; i < 50; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       geometry.vertices.push(
    //         new THREE.Vector3(Math.random(), Math.random(), Math.random())
    //       );
    //     }
    //     const verticeIndex = i * 3;
    //     geometry.faces.push(
    //       new THREE.Face3(verticeIndex, verticeIndex + 1, verticeIndex + 2)
    //     );
    //   }
    //   const material = new THREE.MeshBasicMaterial({
    //     color: "blue",
    //   });
    //   return new THREE.Mesh(geometry, material);
    // };

    const face = () => {
      // Create an empty BufferGeometry
      const geometry = new THREE.BufferGeometry();

      // Create a Float32Array containing the vertices position (3 by 3)
      const positionsArray = new Float32Array([
        0,
        0,
        0, // First vertex
        0,
        1,
        0, // Second vertex
        1,
        0,
        0, // Third vertex
      ]);

      // Create the attribute and name it 'position'
      const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
      geometry.setAttribute("position", positionsAttribute);

      const material = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: true,
      });
      return new THREE.Mesh(geometry, material);
    };

    const faces = () => {
      // Create an empty BufferGeometry
      const geometry = new THREE.BufferGeometry();

      // Create 50 triangles (450 values)
      const count = 50;
      const positionsArray = new Float32Array(count * 3 * 3);
      for (let i = 0; i < count * 3 * 3; i++) {
        positionsArray[i] = (Math.random() - 0.5) * 4;
      }

      // Create the attribute and name it 'position'
      const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
      geometry.setAttribute("position", positionsAttribute);

      const material = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: true,
      });
      return new THREE.Mesh(geometry, material);
    };

    const changeGeometry = (str) => {
      scene.remove(obj);
      switch (str) {
        case 1:
          obj = box();
          break;
        case 2:
          obj = shpere();
          break;
          // case 3:
          //   obj = face();
          //   break;
          // case 4:
          //   obj = faces();
          break;
        case 5:
          obj = face();
          break;
        case 6:
          obj = faces();
          break;
        default:
          obj = box();
      }
      scene.add(obj);
    };

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
      changeGeometry,
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
    background: #fff;
    h3,
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
