'use client';
import { Col, ConfigProvider, Grid, Row, theme as Theme } from 'antd';

const GridPage = () => {
  const { token } = Theme.useToken();
  const { screenXL } = token;
  console.log('screenXL', screenXL);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  console.log(screens);

  return (
    <>
      <Row gutter={[{ xs: 8, md: 16, xl: 32 }, 32]}>
        <Col span={8}>
          <div style={{ height: '100px', background: 'pink' }}>1</div>
        </Col>
        <Col span={8}>
          <div style={{ height: '100px', background: 'beige' }}>2</div>
        </Col>
        <Col span={8}>
          <div style={{ height: '100px', background: 'BurlyWood' }}>3</div>
        </Col>
      </Row>
      {/* <Row wrap={true}>
        <Col span={4} order={1}>
          <div style={{ height: '100px', background: 'pink' }}>1</div>
        </Col>
        <Col span={8} order={2} offset={3}>
          <div style={{ height: '100px', background: 'beige' }}>2</div>
        </Col>
        <Col span={8} order={3}>
          <div style={{ height: '100px', background: 'BurlyWood' }}>3</div>
        </Col>
        <Col span={8} order={3}>
          <div style={{ height: '100px', background: 'BurlyWood' }}>3</div>
        </Col>
      </Row> */}
    </>
  );
};

export default GridPage;
