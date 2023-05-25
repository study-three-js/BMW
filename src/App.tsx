import { useRef, useEffect, useState } from 'react'
import './App.css'

import * as THREE from 'three'
import initFun from './hooks/init'
import hooks from './hooks/hooks'
import carFun from './hooks/car'
import animations from './hooks/animations'

// 导入gltf载入库 - 用于创出模型
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";


/**
 * ⚠！！！必须放外部，放里面useState会重新渲染界面
 */
const { scene, camera, renderer, controls } = initFun(THREE)
const { colors, bodyMa, glassMa } = hooks()
const { gridHelper, } = carFun(THREE, scene)


function App() {
  //设置加载
  const [loadingProcess, setLoadingProcess] = useState(0)

  //选择车身颜色
  const [bodyColorIndex, setBodyColorIndex] = useState(0)
  let bodyMaterial: { color: { set: (arg0: string) => void }; clearcoatRoughness: number }, frontMaterial: { color: { set: (arg0: string) => void }; clearcoatRoughness: number }, hoodMaterial: { color: { set: (arg0: string) => void }; clearcoatRoughness: number }, wheelsMaterial: { color: { set: (arg0: string) => void } }, glassMaterial: { transmission: number }
  const selBodyColor = (index: number) => {
    setBodyColorIndex(index)

    bodyMaterial.color.set(colors[index]);
  }
  //选择引擎颜色
  const [hoodColorIndex, setHoodColorIndex] = useState(0)
  const selHoodColor = (index: number) => {
    setHoodColorIndex(index)

    hoodMaterial.color.set(colors[index]);
  }
  //选择前脸颜色
  const [frontColorIndex, setFrontColorIndex] = useState(0)
  const selFrontColor = (index: number) => {
    setFrontColorIndex(index)

    frontMaterial.color.set(colors[index]);
  }
  //选择轮毂颜色
  const [wheelsColorIndex, setWheelsColorIndex] = useState(0)
  const selwheelsColor = (index: number) => {
    setWheelsColorIndex(index)

    wheelsMaterial.color.set(colors[index]);
  }

  //选择贴膜材质
  const [bodyMaterialIndex, setMaterialIndex] = useState(0)
  const selBodyMaterial = (index: number) => {
    setMaterialIndex(index)

    bodyMaterial.clearcoatRoughness = bodyMa[index].value;
    frontMaterial.clearcoatRoughness = bodyMa[index].value;
    hoodMaterial.clearcoatRoughness = bodyMa[index].value;
  }
  //选择贴膜材质
  const [glassMaterialIndex, setGlassMaterialIndex] = useState(0)
  const selGlassMaterial = (index: number) => {
    setGlassMaterialIndex(index)

    glassMaterial.transmission = glassMa[index].value;
  }

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
    controls && controls.update();

    // 补间动画
    TWEEN && TWEEN.update();

    wheelsRender()
  }

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.appendChild(renderer.domElement)

    animate()

    const {
      bodyMaterial: body,
      frontMaterial: front,
      hoodMaterial: hood,
      wheelsMaterial: wheels,
      glassMaterial: glass,
    } = carInitFun()
    bodyMaterial = body
    frontMaterial = front
    hoodMaterial = hood
    wheelsMaterial = wheels
    glassMaterial = glass
  }, [])


  const carInitFun = () => {
    // 加载汽车
    // 实例化draco载入库
    const dracoLoader = new DRACOLoader();
    // 添加draco载入库
    dracoLoader.setDecoderPath("/src/assets/draco/");

    // 设置加载管理器 --- 进度条
    const loadingManager = new THREE.LoadingManager();
    let loadingProcessTimeout: number | null | undefined = null
    loadingManager.onProgress = async (url, loaded, total) => {
      // console.log('模型进度百分比', parseFloat(((loaded / total) * 100).toFixed(2)) + '%');
      if (Math.floor(loaded / total * 100) === 100) {
        loadingProcessTimeout && clearTimeout(loadingProcessTimeout);
        loadingProcessTimeout = setTimeout(() => {
          setLoadingProcess(Math.floor(loaded / total * 100))
          animations.animateCamera(camera, controls, { x: -1.6, y: 2.2, z: 1.2 }, { x: 0, y: 0, z: 0 }, 2400, () => { });
        }, 800);
      } else {
        setLoadingProcess(Math.floor(loaded / total * 100))
      }
    };

    // 实例化gltf载入库
    const loader = new GLTFLoader(loadingManager).setPath("/src/assets/model/");
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
    const wheels: Mesh<any, any>[] = []; // 汽车轮毂  
    let cartBody: Mesh<any, any>, frontCar, hoodCar, glassCar;// cartBody-车身 frontCar-前脸 hoodCar-引擎盖 glassCar-挡风玻璃
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
      [key: string]: [value: string, material: THREE.Material]
    }

    // 材质映射表
    const materialMap: MaterialMap = {
      wheels: ['轮毂', wheelsMaterial],
      body: ['Mesh002', bodyMaterial],
      front: ['前脸', frontMaterial],
      hood: ['引擎盖_1', hoodMaterial],
      glass: ['挡风玻璃', glassMaterial]
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

          // 根据名称设置材质
          for (const [key, [keyword, material]] of Object.entries(materialMap)) {
            if (!child.name.includes(keyword)) { continue }

            child.material = material

            switch (key) {
              case 'wheels':
                wheels.push(child)
                if (wheels.length > 0) {
                  console.log(wheels, '====wheels');
                }

                break
              case 'body':
                cartBody = child
                break
              case 'front':
                // frontCar = child
                break
              case 'hood':
                // hoodCar = child
                break
              case 'glass':
              // glassCar = child
            }

            break
          }
        }
      })
      scene.add(bmw)
    })

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    return {
      bodyMaterial,
      frontMaterial,
      hoodMaterial,
      wheelsMaterial,
      glassMaterial
    }
  }

  const wheelsRender = () => {
    const time = - performance.now() / 1000;
    // wheels.forEach(wheel => {
    //   wheel.rotation.x = time % (2 * Math.PI);
    // })

    gridHelper.position.z = - (time) % 1;
  }


  return (
    <>
      <div className='home'>
        {/* 车子 */}

        <div className="container" ref={containerRef}></div>

        <div className="home-content">
          <h1>宝马I8-801</h1>
          <h2>车身选择</h2>
          <div className='flex'>
            {colors.map((color, index) => (
              // className={['block', colorIndex == index ? 'active' : ''].join(' ')}
              <div
                style={{ 'background': color }}
                key={color}
                className={`block ${bodyColorIndex == index ? 'active' : ''}`}
                onClick={() => selBodyColor(index)}
              />
            ))}
          </div>
          <h2>引擎盖选择</h2>
          <div className='flex'>
            {colors.map((color, index) => (
              <div
                style={{ 'background': color }}
                key={color}
                className={`block ${hoodColorIndex == index ? 'active' : ''}`}
                onClick={() => selHoodColor(index)}
              />
            ))}
          </div>
          <h2>前脸材质选择</h2>
          <div className='flex'>
            {colors.map((color, index) => (
              <div
                style={{ 'background': color }}
                key={color}
                className={`block ${frontColorIndex == index ? 'active' : ''}`}
                onClick={() => selFrontColor(index)}
              />
            ))}
          </div>

          <h2>车身贴膜选择</h2>
          <div className='flex'>
            {bodyMa.map((material, index) => (
              <h3
                key={material.value}
                className={`block ${bodyMaterialIndex == index ? 'active' : ''}`}
                onClick={() => selBodyMaterial(index)}
              >{material.name}</h3>
            ))}
          </div>
          <h2>挡风玻璃选择</h2>
          <div className='flex'>
            {glassMa.map((material, index) => (
              <h3
                key={material.value}
                className={`block ${glassMaterialIndex == index ? 'active' : ''}`}
                onClick={() => selGlassMaterial(index)}
              >{material.name}</h3>
            ))}
          </div>

          <h2>轮毂选择</h2>
          <div className='flex'>
            {colors.map((color, index) => (
              <div
                style={{ 'background': color }}
                key={color}
                className={`block ${wheelsColorIndex == index ? 'active' : ''}`}
                onClick={() => selwheelsColor(index)}
              />
            ))}
          </div>
        </div>


        {/* 加载器 */}
        {loadingProcess === 100 ? '' : (
          <div className="loading">
            <div className="box">{loadingProcess} %</div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
