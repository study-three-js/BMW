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
const { colors, materials } = hooks()
const { bodyMaterial, frontMaterial, hoodMaterial, wheelsMaterial } = carFun(THREE, scene)

function App() {
  //选择车身颜色
  const [colorIndex, setColorIndex] = useState(0)
  const selColor = (index: number) => {
    setColorIndex(index)

    bodyMaterial.color.set(colors[index]);
    frontMaterial.color.set(colors[index]);
    hoodMaterial.color.set(colors[index]);
    wheelsMaterial.color.set(colors[index]);
    // glassMaterial.color.set(colors[index]);
  }
  //选择贴膜材质
  const [materialIndex, setMaterialIndex] = useState(0)
  const selMaterial = (index: number) => {
    setMaterialIndex(index)

    bodyMaterial.clearcoatRoughness = materials[index].value;
    frontMaterial.clearcoatRoughness = materials[index].value;
    hoodMaterial.clearcoatRoughness = materials[index].value;
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
          <h1>汽车展示与选配</h1>
          <h2>选择车身颜色</h2>
          <div className='flex'>
            {colors.map((color, index) => (
              // className={['block', colorIndex == index ? 'active' : ''].join(' ')}
              <div
                style={{ 'background': color }}
                key={color}
                className={`block ${colorIndex == index ? 'active' : ''}`}
                onClick={() => selColor(index)}
              />
            ))}
          </div>

          <h2>选择贴膜材质</h2>
          <div className='flex'>
            {materials.map((material, index) => (
              <h3
                key={material.value}
                className={`block ${materialIndex == index ? 'active' : ''}`}
                onClick={() => selMaterial(index)}
              >{material.name}</h3>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
