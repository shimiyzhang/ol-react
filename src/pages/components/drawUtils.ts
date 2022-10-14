import { Feature } from 'ol';
import { getLength } from 'ol/sphere';
import { Circle, LineString } from 'ol/geom';
import Polygon, { fromCircle } from 'ol/geom/Polygon';
import { boundingExtent, getCenter } from 'ol/extent';
import * as turf from '@turf/turf';

/**
 * 二叉树的构造函数
 * @author zsm
 * @date 2022/10/14 14:54
 */
class TreeNode {
  node: any;
  left: any;
  right: any;
  constructor(node: number[]) {
    this.node = node;
    this.left = null;
    this.right = null;
  }
}

/**
 * 根据先序遍历数组生成满二叉树
 * @author zsm
 * @date 2022/10/14 14:43
 * @param NLR 先序遍历数组
 */
const getTreeNode = (NLR: number[][]) => {
  const n = NLR.length;
  const node = new TreeNode(NLR[0]);
  // 分割数组
  const left = NLR.slice(1, (n - 1) / 2 + 1);
  const right = NLR.slice((n - 1) / 2 + 1);
  if (left.length > 2) {
    node.left = getTreeNode(left);
    node.right = getTreeNode(right);
  }
  console.log('node', node);
  return node;
};

/**
 * 根据间距递归细分坐标点
 * @author zsm
 * @date 2022/10/13 15:55
 * @param start 起点
 * @param end 终点
 * @param space 最小间距
 * @param points 坐标数组
 * @return points 坐标数组
 */
const splitPoints = (start: any, end: any, space: any, points: any) => {
  const line = new LineString([start, end]);
  const length = getLength(line);
  if (length > space) {
    const extent = boundingExtent([start, end]);
    const center = getCenter(extent);
    points.push(center);
    splitPoints(start, center, space, points);
    splitPoints(center, end, space, points);
  }
  return points;
};

/**
 * 根据间距获取等距离坐标点
 * @author zsm
 * @date 2022/10/13 09:32
 */
const getSpacePoints = (coords: any, space: number) => {
  const num = coords.length;
  const pArr: any = [];
  pArr.push(coords[0]);

  // 获取等距点
  for (let i = 0; i < num; i++) {
    const n = pArr.length;
    const str = pArr[n - 1];

    const line = new LineString([str, coords[i]]);
    const length = getLength(line);

    // space 间距
    if (length >= space) {
      pArr.push(coords[i]);
    }
  }

  const start = pArr[0];
  const end = pArr[pArr.length - 1];
  const newP = splitPoints(start, end, space, []);
  const test = splitPoints([0, 0], [8, 0], 1, []);
  getTreeNode(test);
  return pArr;
};

/**
 * 绘制云状
 * @author zsm
 * @date 2022/10/13 09:43
 */
export const drawCloud = (feature: any, smoothened: any, drawSource: any) => {
  let allPolt;
  const space = 2;
  let pArr = getSpacePoints(smoothened, space);
  pArr.push(pArr[0]);
  for (let i = 0; i < pArr.length - 1; i++) {
    const extent = boundingExtent([pArr[i], pArr[i + 1]]);
    const center = getCenter(extent);
    const line = new LineString([pArr[i], pArr[i + 1]]);
    const length = getLength(line);
    // 半径必须大于多边形该边长的一半，否则后续联合多边形会出现空隙
    const radius = length * 0.6;
    const polygon = new Feature({
      geometry: fromCircle(new Circle(center, radius)),
    });
    const points: any = polygon.getGeometry()?.getCoordinates();
    // @ts-ignore
    const poly = turf.polygon(points);
    if (allPolt) {
      allPolt = turf.union(allPolt, poly);
    } else {
      allPolt = poly;
    }
  }
  const allCoords: any = allPolt?.geometry.coordinates;
  const cloud = new Feature({
    geometry: new Polygon([allCoords[0]]),
  });
  drawSource.addFeatures([cloud]);
  feature.setGeometry();
};
