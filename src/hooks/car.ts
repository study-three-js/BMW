import { Scene } from "three"
// 导入gltf载入库 - 用于创出模型
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * @description 优化后的代码
 * @param THREE 
 * @param scene 
 * @returns 
 */
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
  const material = {
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    // 清洁度
    clearcoat: 1,
    clearcoatRoughness: 0,
  }
  // 车身
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ ...material })
  // 前脸
  const frontMaterial = new THREE.MeshPhysicalMaterial({ ...material })
  // 引擎盖
  const hoodMaterial = new THREE.MeshPhysicalMaterial({ ...material })
  // 汽车轮毂
  const wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  })
  // 挡风玻璃
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.9, //1表示完全通透
    transparent: true, //设置透明
    metalness: 0,
    roughness: 0,
  })


  interface MaterialMap {
    [key: string]: THREE.Material
  }

  // 材质映射表
  const materialMap: MaterialMap = {
    '轮毂': wheelsMaterial,
    'Mesh002': bodyMaterial,
    '前脸': frontMaterial,
    '引擎盖_1': hoodMaterial,
    '挡风玻璃': glassMaterial
  }

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

        const name = child.name

        // 根据名称设置材质
        for (const key in materialMap) {
          if (name.includes(key)) {
            child.material = materialMap[key]
            break
          }
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