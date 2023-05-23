const hooks = () => {
  // 设置车身颜色
  const colors = ["red", "blue", "green", "gray", "orange", "purple"];
  // 设置车身 贴膜材质
  const materials = [
    { name: "磨砂", value: 1 },
    { name: "冰晶", value: 0 },
  ];
  return {
    colors,
    materials,
  }
}

export default hooks