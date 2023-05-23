import { Scene } from "three"
// 导入gltf载入库 - 用于创出模型
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const carFun = (THREE: typeof import("three"), scene: Scene) => {
  // 添加地面网格
  const gridHelper = new THREE.GridHelper(10, 10)
  // gridHelper.material.opacity = 0.2
  // gridHelper.material.transparent = true
  scene.add(gridHelper)

  // 加载汽车
  // 实例化draco载入库
  const dracoLoader = new DRACOLoader();
  // 添加draco载入库
  dracoLoader.setDecoderPath("/src/assets/draco/");

  // 实例化gltf载入库
  const loader = new GLTFLoader().setPath("/src/assets/model/");
  // 添加draco载入库
  loader.setDRACOLoader(dracoLoader);

  // 加载模型
  // 这里报错把 three.js换成^0.137.5 版本
  loader.load("bmw01.glb", gltf => {
    const bmw = gltf.scene
    scene.add(bmw)
  })
}

export default carFun