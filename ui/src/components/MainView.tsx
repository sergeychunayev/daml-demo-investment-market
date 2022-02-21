// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Container, Grid, Header, Segment, Form, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell } from 'semantic-ui-react';
import { Investment } from '@daml.js/investment-market';
import { useParty, useLedger, useStreamQueries } from '@daml/react';
import {v4 as uuid} from 'uuid';

const MainView: React.FC = () => {
  const username = useParty();
  const {contracts: investments, loading: investmentsLoading} = useStreamQueries(Investment.Investment)
  const [description, setDescription] = useState('Bridge');
  const [totalAmount, setTotalAmount] = useState('1000000000');
  const ledger = useLedger();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    ledger.create(Investment.Investment, {id: uuid(), owner: username, description, totalAmount, investors: [], investmentAmounts: []})
  };

  console.log({investments})

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header>
                Add investment
            </Header>
            <Segment>
              <Form onSubmit={onSubmit}>
                <Form.Input label="description" value={description} onChange={event => setDescription(event.target.value)}></Form.Input>
                <Form.Input label="amount" value={totalAmount} onChange={event => setTotalAmount(event.target.value)}></Form.Input>
                <Form.Button type='submit'>Submit</Form.Button>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Header>
              Investments
            </Header>
            <Segment>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    investments.map(v =>
                      <TableRow key={v.contractId}>
                        <TableCell>
                          { v.payload.description }
                        </TableCell>
                        <TableCell>
                          { v.payload.totalAmount }
                        </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
