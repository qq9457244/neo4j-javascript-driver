/**
 * Copyright (c) 2002-2017 "Neo Technology,","
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import neo4j from '../../src/v1';
import sharedNeo4j from '../internal/shared-neo4j';

describe('result stream', () => {

  let driver, session;

  beforeEach(done => {
    driver = neo4j.driver('bolt://localhost', sharedNeo4j.authToken);
    session = driver.session();

    session.run("MATCH (n) DETACH DELETE n").then(done);
  });

  afterEach(() => {
    driver.close();
  });

  it('should allow chaining `then`, returning a new thing in each', done => {
    // When & Then
    session.run( "RETURN 1")
      .then(() => 'first')
      .then(arg => {
        expect(arg).toBe( "first" );
        return "second";
      })
      .then(arg => {
        expect(arg).toBe( "second" );
      })
      .then(done);
  });

  it('should allow catching exception thrown in `then`', done => {
    // When & Then
    session.run( "RETURN 1")
      .then(() => {
        throw new Error("Away with you!");
      })
      .catch(err => {
        expect(err.message).toBe( "Away with you!" );
        done()
      });
  });

  it('should handle missing onCompleted', done => {
    session.run('RETURN 1').subscribe({
      onNext: record => {
        expect(record.get(0).toInt()).toEqual(1);
        done();
      },
      onError: error => {
        console.log(error);
      }
    });
  });
});
