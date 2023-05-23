import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const initFun = (THREE: typeof import("three")) => {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, 6)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 初始化渲染背景
  renderer.setClearColor("#000")
  scene.background = new THREE.Color("#ccc")

  // 页面缩放事件监听
  window.addEventListener('resize', () => {
    // 更新渲染
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 更新相机
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  const controls = new OrbitControls(camera, renderer.domElement)

  return {
    scene,
    camera,
    renderer,
    controls
  }
}

export default initFun