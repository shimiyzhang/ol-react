import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import View from 'ol/View';
import { createStringXY } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import {
  defaults as defaultControls,
  MousePosition,
  ScaleLine,
  FullScreen,
} from 'ol/control';
import {
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import { Button, Radio, Space } from 'antd';
import {
  ArrowUpOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { isNullString } from '@/utils/utils';

const Index: React.FC = () => {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);

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

    // 比例尺控件
    const scaleLineControl = new ScaleLine({
      units: 'metric', // 度量单位(metric公制)
      // @ts-ignore
      target: document.getElementsByClassName('scale-line')[0],
    });

    // 全屏控件
    const fullScreenControl = new FullScreen({
      className: 'ol-full-screen',
    });

    // 默认图层
    const defaultLayer = new Tile({
      // @ts-ignore
      name: '默认图层',
      source: new OSM(),
      visible: true,
    });

    // 高德地图图层
    const amapLayer = new Tile({
      // @ts-ignore
      name: '高德图层',
      source: new XYZ({
        url:
          'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
      }),
      visible: false,
    });

    // 初始化地图
    const map = new Map({
      // 设置挂载点为map
      target: 'map',
      // 设置图层
      layers: [defaultLayer, amapLayer],
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
    map.addControl(scaleLineControl);
    map.addControl(fullScreenControl);

    // @ts-ignore
    setMap(map);
  }, []);

  // 切换显示图层
  const changeLayerVisible = (e: any) => {
    console.log(e);
    // @ts-ignore
    const layers = map.getLayers().getArray();
    layers.forEach((layer: any) => {
      const name = layer.get('name');
      // 选中时显示，未选中时隐藏
      layer.setVisible(e.target.value === name);
    });
  };

  // 图层列表
  const layersRender = () => {
    // @ts-ignore
    const layers = map.getLayers().getArray();
    let options: any = [];
    let defaultValue: string = '默认图层';
    layers.forEach((layer: any) => {
      const name = layer.get('name');
      options.push({ label: name, value: name });
    });
    return (
      <Space className="layers-list">
        <Radio.Group
          options={options}
          defaultValue={defaultValue}
          onChange={changeLayerVisible}
          optionType="button"
          buttonStyle="solid"
        />
      </Space>
    );
  };

  //缩放
  const changeZoom = (type: string) => {
    // @ts-ignore
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
    // @ts-ignore
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
      {/*比例尺控件*/}
      <Button className="scale-line" type="default" />
      {!isNullString(map) && layersRender()}
    </>
  );
};

export default Index;
