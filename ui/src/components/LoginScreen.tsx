// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import Credentials from '../Credentials';
import { DamlHubLogin as DamlHubLoginBtn } from '@daml/hub-react';
import { authConfig, Insecure } from '../config';
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  onLogin: (credentials: Credentials) => void;
}

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {

  const login = useCallback(async (credentials: Credentials) => {
    try {
      onLogin(credentials);
    } catch(error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
    }
  }, [onLogin]);

  const wrap: (c: JSX.Element) => JSX.Element = (component) =>
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' size='huge' style={{color: '#223668'}}>
          <Header.Content>
            Create
            <Image
              as='a'
              href='https://www.daml.com/'
              target='_blank'
              src='/daml.svg'
              alt='Daml Logo'
              spaced
              size='small'
              verticalAlign='bottom'
            />
            App
          </Header.Content>
        </Header>
        <Form size='large' className='test-select-login-screen'>
          <Segment>
            {component}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>;

  const InsecureLogin: React.FC<{auth: Insecure}> = ({auth}) => {
    const [username, setUsername] = React.useState('');
    const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      await login({party: username,
                   token: auth.makeToken(username)});
    }
    return wrap(<>
      {/* FORM_BEGIN */}
      <Form.Input fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={username}
                  className='test-select-username-field'
                  onChange={e => setUsername(e.currentTarget.value)} />
      <Button primary
              fluid
              className='test-select-login-button'
              onClick={handleLogin}>
        Log in
      </Button>
      {/* FORM_END */}
    </>);
  };

  const DamlHubLogin: React.FC = () => (
    wrap(
      <DamlHubLoginBtn
        onLogin={creds => {
          if (creds) {
            login(creds);
          }
        }}
        options={{
          method: {
            button: {
              render: () => <Button primary fluid/>,
            },
          },
        }}
        />
    )
  );

  const Auth0Login: React.FC = () => {
    const { user, isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    (async function () {
      if (isLoading === false && isAuthenticated === true) {
        if (user !== undefined) {
          const creds: Credentials = {
            party: user["https://daml.com/ledger-api"],
            token: (await getAccessTokenSilently({
                     audience: "https://daml.com/ledger-api"}))};
          login(creds);
        }
      }
    })();
    return wrap(<Button primary
                        fluid
                        className='test-select-login-button'
                        disabled={isLoading || isAuthenticated}
                        loading={isLoading || isAuthenticated}
                        onClick={loginWithRedirect}>
                  Log in
                </Button>);
  };

  if (authConfig.provider === "none") {
  } else if (authConfig.provider === "daml-hub") {
  } else if (authConfig.provider === "auth0") {
  }
  return authConfig.provider === "none"
       ? <InsecureLogin auth={authConfig} />
       : authConfig.provider === "daml-hub"
       ? <DamlHubLogin />
       : authConfig.provider === "auth0"
       ? <Auth0Login />
       : <div>Invalid configuation.</div>;
};

export default LoginScreen;