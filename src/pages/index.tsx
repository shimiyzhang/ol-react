import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import Map from 'ol/Map';
import { Tile, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector, XYZ } from 'ol/source';
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
import { Feature } from 'ol';
import { LineString, Point, Circle, Polygon } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromCircle, fromExtent } from 'ol/geom/Polygon';

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
      // projection: 'EPSG:4326',
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
        rotation: 0, // 初始旋转（以弧度为单位）(顺时针正旋转，0表示北)
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

    // 监听事件
    map.on('click', (event) => {
      console.log('click', event);
    });
    map.on('singleclick', (event) => {
      console.log('singleclick', event);
    });
    map.on('dblclick', (event) => {
      console.log('dblclick', event);
    });

    // 创建一个矢量对象(点)
    const point = new Feature({
      // 定义几何类型
      geometry: new Point(fromLonLat([113.62, 34.75])),
    });

    // 定义统一的图形样式
    const style = new Style({
      // 填充色
      fill: new Fill({
        color: 'rgba(255,255,255,0.5)',
      }),
      // 边线颜色
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      // 形状
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    });

    // 设置点的样式
    point.setStyle(style);

    // 创建一个线
    const line = new Feature({
      geometry: new LineString([
        fromLonLat([103.62, 34.75]),
        fromLonLat([123.62, 34.75]),
      ]),
    });

    // 设置线的样式
    line.setStyle(style);

    // 创建一个圆
    const circle = new Feature({
      geometry: new Circle(fromLonLat([113.62, 34.75]), 700000),
    });

    // 设置圆的样式
    circle.setStyle(style);

    //创建一个圆
    const inCircle = new Circle(fromLonLat([113.62, 34.75]), 700000);

    //根据圆获取多边形
    const square = new Feature({
      // 从圆创建常规多边形
      // 参数
      // circle 圆几何图形
      // sides 多边形的边数。默认值为 32。
      // angle 多边形的第一个顶点的起始角度（以逆时针弧度表示）。0 表示东。默认值为 0。
      geometry: fromCircle(inCircle, 4, 150),
    });

    // 设置多边形的样式
    square.setStyle(style);

    //根据范围获取多边形
    const rectangle = new Feature({
      // xy布局(minx, miny, maxx, maxy)
      geometry: fromExtent([13000000.0, 5000000.0, 15000000.0, 6000000.0]),
    });

    rectangle.setStyle(style);

    //创建一个多变形
    const polygon = new Feature({
      // 定义多边形的线性环数组(第一个线性环定义了多边形的外部边界或表面)
      geometry: new Polygon([
        [
          [10000000.0, 6000000.0],
          [12000000.0, 5500000.0],
          [10000000.0, 5000000.0],
        ],
      ]),
    });
    //设置区样式信息
    polygon.setStyle(style);

    // 实例化一个矢量图层Vector作为绘制层
    const source = new Vector({
      // @ts-ignore
      features: [point, line, circle, square, rectangle, polygon],
    });

    // 创建一个图层
    const vector = new VectorLayer({
      source: source,
    });

    //将绘制层添加到地图容器中
    map.addLayer(vector);

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
      if (name) {
        options.push({ label: name, value: name });
      }
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
