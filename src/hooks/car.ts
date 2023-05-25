import { Scene } from "three"

/**
 * @description 优化后的代码
 * @param THREE 
 * @param scene 
 * @returns 
 */
const carFun = (THREE: typeof import("three"), scene: Scene) => {
  // 添加地面网格
  const gridHelper = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff)
  gridHelper.material.opacity = 0.2;
  gridHelper.material.depthWrite = false;
  gridHelper.material.transparent = true;
  scene.add(gridHelper)
  return {
    gridHelper
  }
}

export default carFun