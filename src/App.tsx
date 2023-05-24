import { useEffect, useRef } from 'react'
import './App.css'

import * as THREE from 'three'
import initFun from './hooks/init'
import hooks from './hooks/hooks'
import carFun from './hooks/car'

import { useState } from "react";

/**
 * ！！！必须放外部，放里面useState会重新渲染界面
 */
const { scene, camera, renderer, controls } = initFun(THREE)
const { colors, bodyMa, glassMa } = hooks()
const {
  bodyMaterial,
  frontMaterial,
  hoodMaterial,
  wheelsMaterial,
  glassMaterial
} = carFun(THREE, scene)

function App() {
  //选择车身颜色
  const [bodyColorIndex, setBodyColorIndex] = useState(0)
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
  }


  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.appendChild(renderer.domElement)

    animate()
  }, [])


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
      </div>
    </>
  )
}

export default App
