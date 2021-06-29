// components/Layout.js

import Head from 'next/head';
import Image from 'next/image';
// import Header from "./Header";
import NavBar from "./NavBar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import dynamic from 'next/dynamic';
const Header = dynamic(() => import("./Header"), { ssr: false });

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%"
};

const contentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column"
};

const Layout = props => (
  <div>
    <Head>
      <title>Online Pictionary</title>
      <meta name="description" content="Play pictionary online" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="Layout" style={layoutStyle}>
      <Header />
      <div className="Content" style={contentStyle}>
        <Container>
          <Row>
            <Col>
              {props.children}
            </Col>
          </Row>
        </Container>
      </div>
      <NavBar />
    </div>
  </div>
);

export default Layout;