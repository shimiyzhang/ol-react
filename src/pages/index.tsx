import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
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
      <div ref={mapElement} id="map"></div>
      {/* 地图控件 */}
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
    </>
  );
};

export default Index;
