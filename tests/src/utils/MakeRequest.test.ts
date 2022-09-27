import makeRequest from '../../../src/utils/MakeRequest'
// import { ungzip } from 'node-gzip';
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
let server: any;
describe('MakeRequest', () => {
    beforeEach(() => {
        
        app.post('/test', function (req: any, res: any) {
            console.log('req headers: ', req.headers);
            console.log('test')
            console.log('req body: ', req.body);
            res.send({'status': 200})
          })

          server = app.listen(80)
          
	});
    afterEach(() => {
		server.close();
	});
    it('should make a request and validate token', async function () {
        
        let response;
        response = await makeRequest(
            'POST',
            'http://localhost',
            '/test',
            'testBody',
            'testAccessId',
            'superSecretAccessKey'
        );

        expect(response).toBeDefined();
        console.log("response in test: ", await response.json())

    })

})