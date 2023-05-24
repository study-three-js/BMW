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

  /**
   * 材质
   * wheels-汽车轮毂
   * cartBody-车身 
   * frontCar-前脸
   * hoodCar-引擎盖
   * glassCar-挡风玻璃
   */
  // const wheels = []; // 汽车轮毂  
  // let cartBody, frontCar, hoodCar, glassCar;// cartBody-车身 frontCar-前脸 hoodCar-引擎盖 glassCar-挡风玻璃
  // 创建材质
  // 车身
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    // 清洁度
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  // 前脸
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    // 清洁度
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  // 引擎盖
  const hoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    // 清洁度
    clearcoat: 1,
    clearcoatRoughness: 0,
  })
  // 汽车轮毂
  const wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  })
  // 挡风玻璃
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1, //完全通透
    transparent: true, //设置透明
    metalness: 0,
    roughness: 0,
  })



  // 加载模型
  // 这里报错把 three.js换成^0.137.5 版本
  loader.load("bmw01.glb", gltf => {
    const bmw = gltf.scene
    /**
     * traverse 是遍历循环所有子节点（包括子节点的子节点）
     */
    bmw.traverse(child => {
      if (child instanceof THREE.Mesh && child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        // 判断是否是轮毂
        if (child.name.includes('轮毂')) {
          child.material = wheelsMaterial
          // wheels.push(child)
        }
        // 判断是否是车身
        if (child.name.includes('Mesh002')) {
          child.material = bodyMaterial
          // cartBody = child
        }
        // 判断是否是前脸
        if (child.name.includes('前脸')) {
          child.material = frontMaterial
          // frontCar = child
        }
        // 判断是否是引擎盖
        if (child.name.includes('引擎盖_1')) {
          child.material = hoodMaterial
          // hoodCar = child
        }
        // 判断是否是挡风玻璃
        if (child.name.includes('挡风玻璃')) {
          child.material = glassMaterial
          // glassCar = child
        }
      }
    })
    scene.add(bmw)
  })


  return {
    bodyMaterial,
    frontMaterial,
    hoodMaterial,
    wheelsMaterial,
    glassMaterial
  }
}

export default carFun