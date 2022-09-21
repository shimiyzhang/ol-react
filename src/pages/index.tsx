import React, { useEffect } from 'react';
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

const Index: React.FC = () => {
  useEffect(() => {
    const map = new Map({
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
  });

  return <div id="map"></div>;
};

export default Index;
