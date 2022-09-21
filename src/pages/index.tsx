import React, { useEffect } from 'react';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import './index.less';

const Index: React.FC = () => {
  useEffect(() => {
    let map = new Map({
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
      }),
    });
  });

  return <div id="map"></div>;
};

export default Index;
