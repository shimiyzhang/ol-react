import React from 'react';
import { Button, Popover, Space, Tooltip } from 'antd';
import styles from '../index.less';
import {
  BorderOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  Loading3QuartersOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import Cloud from '@/assets/images/cloud.svg';

interface CreateFormProps {
  onClickDrew: (value: string) => void; // 绘制
}

// 绘制菜单
const DrewLayer: React.FC<CreateFormProps> = (props) => {
  const { onClickDrew } = props;

  // 投影方式
  const contentDraw = (
    <Space direction="vertical" size={1}>
      <Tooltip title="线" placement="right">
        <Button
          className={styles.drewBtn}
          icon={<RiseOutlined />}
          onClick={() => onClickDrew('画线')}
        />
      </Tooltip>
      <Tooltip title="云" placement="right">
        <Button
          className={styles.drewBtn}
          icon={
            <img src={Cloud} style={{ width: 22, height: 25, marginTop: -4 }} />
          }
          onClick={() => onClickDrew('云')}
        />
      </Tooltip>
      <Tooltip title="区域" placement="right">
        <Button
          className={styles.drewBtn}
          icon={<BorderOutlined />}
          onClick={() => onClickDrew('区域')}
        />
      </Tooltip>
      <Tooltip title="圆" placement="right">
        <Button
          className={styles.drewBtn}
          icon={<Loading3QuartersOutlined />}
          onClick={() => onClickDrew('圆')}
        />
      </Tooltip>
      <Tooltip title="清除上次绘制" placement="right">
        <Button
          className={styles.drewBtn}
          icon={<CloseOutlined />}
          onClick={() => onClickDrew('清除')}
        />
      </Tooltip>
      <Tooltip title="全部清除" placement="right">
        <Button
          className={styles.drewBtn}
          icon={<DeleteOutlined />}
          onClick={() => onClickDrew('全部清除')}
        />
      </Tooltip>
    </Space>
  );

  return (
    <>
      <Space direction="vertical" className={styles.drewlayerDiv} size={1}>
        {/* 绘制 */}
        <Popover
          placement="bottom"
          content={contentDraw}
          trigger={['hover']}
          overlayClassName="drewDrop"
        >
          <Button className={styles.btn} icon={<EditOutlined />} />
        </Popover>
      </Space>
    </>
  );
};

export default DrewLayer;
