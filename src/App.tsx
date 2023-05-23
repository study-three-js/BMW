import { useEffect, useRef } from 'react'
import './App.css'

import * as THREE from 'three'
import initFun from './hooks/init'
import hooks from './hooks/hooks'
import carFun from './hooks/car'

import { useState } from "react";

function App() {

  const { scene, camera, renderer, controls } = initFun(THREE)
  const { colors, materials } = hooks()
  carFun(THREE, scene)


  const [colorIndex, setColorIndex] = useState(0)
  const selColor = (index: number) => {
    setColorIndex(index)
  }
  const [materialIndex, setMaterialIndex] = useState(0)
  const selMaterial = (index: number) => {
    setMaterialIndex(index)
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
  })
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
