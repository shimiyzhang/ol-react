import React, { useEffect, useRef } from 'react';
import './index.less';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import {
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import { Button, Space } from 'antd';
import {
  ArrowUpOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';

const Index: React.FC = () => {
  const mapElement = useRef(null);
  let map: any = null;

  useEffect(() => {
    console.log('reload...');

    // 鼠标位置控件
    const mousePositionControl = new MousePosition({
      // 坐标格式
      // createStringXY可用于将 {坐标} 格式化为字符串,参数为小数位数
      coordinateFormat: createStringXY(2),
      // 投影。默认是视图投影
      projection: 'EPSG:4326',
      // @ts-ignore
      target: document.getElementsByClassName('mouse-position')[0],
      placeholder: '已移出',
    });

    // 初始化地图
    map = new Map({
      // 设置挂载点为map
      target: 'map',
      // 设置图层
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      // 设置地图的可视区域，center为中心点，zoom为缩放的层级
      view: new View({
        center: fromLonLat([116.2, 39.56]),
        zoom: 5,
        minZoom: 3,
        maxZoom: 10,
        rotation: 1, // 初始旋转（以弧度为单位）(顺时针正旋转，0表示北)
      }),
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    });
    // 添加控件
    map.addControl(mousePositionControl);
    console.log(map);
  }, []);

  //缩放
  const changeZoom = (type: string) => {
    const view = map.getView();
    const zoom = view.getZoom();
    if (type === 'add') {
      view.setZoom(zoom + 1);
    } else {
      view.setZoom(zoom - 1);
    }
  };

  // 重置旋转角度
  const resetRotation = () => {
    map.getView().setRotation(0);
  };

  return (
    <>
      <div ref={mapElement} id="map" />
      {/* 缩放、旋转控件 */}
      <Space className="controls-box" direction="vertical">
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => changeZoom('add')}
        />
        <Button
          type="default"
          icon={<MinusOutlined />}
          onClick={() => changeZoom('minus')}
        />
        <Button
          type="default"
          icon={<ArrowUpOutlined />}
          onClick={resetRotation}
        />
      </Space>
      {/*鼠标位置控件*/}
      <Button className="mouse-position" type="default" />
    </>
  );
};

export default Index;
