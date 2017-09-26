import { sign } from 'jws';
import * as nock from 'nock';

import { ConnectionUpdateOptions } from '../dist/interfaces';
import { BasiqAPIOptions, ConnectionCreateOptions } from '../lib/';

export class Helper {
  public static baseUrl = 'https://au-api.basiq.io';

  public static authOptions: BasiqAPIOptions = {
    auth: { apiKey: 'abc' },
  };

  public static connectionCreateOptions: ConnectionCreateOptions = {
    loginId: 'gavinBelson',
    password: 'hooli2016',
    externalUserId: '01',
    institution: {
      id: 'AU00000',
    },
  };

  public static connectionUpdateOptions: ConnectionUpdateOptions = {
    password: 'hooli2016',
    externalUserId: '02',
  };

  public static mockAuthRoute(status: number = 200) {
    nock(this.baseUrl)
      .persist()
      .filteringRequestBody(() => '*')
      .post('/oauth2/token', '*')
      .reply(status, Helper.getToken(true))
      ;
  }

  public static getToken(valid: boolean): any {
    const issuedTime = new Date();

    if (!valid) {
      // Make token issued two days ago
      issuedTime.setDate(issuedTime.getDate() - 2);
    }

    const signature = sign({
      header: { alg: 'HS256' },
      payload: {
        'partnerid': 'par123',
        'applicationid': 'app123',
        'exp': issuedTime.getTime(),
        'iat': issuedTime.getTime(),
        'version': '2017-09-04',
      },
      secret: 'super secret key',
    });

    return {
      'access_token': signature,
      'token_type': 'Bearer',
      'expires_in': 3600,
    };
  }
}