const hooks = () => {
  // 设置车身、引擎、前脸、轮毂材质颜色
  const colors = ["red", "blue", "green", "gray", "orange", "purple"];
  // 设置车身 贴膜材质
  const bodyMa = [
    { name: "磨砂", value: 1 },
    { name: "冰晶", value: 0 },
  ];
  // 设置挡风玻璃 材质
  const glassMa = [
    { name: "普通", value: 0.9 },
    { name: "透亮", value: 1 },
  ];
  return {
    colors,
    bodyMa,
    glassMa,
  }
}

export default hooks