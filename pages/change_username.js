import { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import AuthContext from '../store/auth-context';
import Router from 'next/router';

function ChangeUsername() {

  const ctx = useContext(AuthContext);
  const [ username, setUsername ] = useState(ctx.user.username);

  useEffect(() => {
    setUsername(ctx.user.username);
  }, [ctx.user.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    // Auth.updateUsername(usernameonUsernameChange(username);
    ctx.onUsernameChange(username);
    Router.push('/')
  };

  return (
    <Layout>
      <Row className="justify-content-md-center mt-4">
        <Col sm={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter a username with minimum 3 characters
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>

          </Form>
        </Col>
      </Row>
    </Layout>
  )
}

export default ChangeUsername;