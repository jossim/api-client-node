'use strict';

const Lab = require('lab');
const Code = require('code');
const Client = require('../client.js');
let apiClient;

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Signup', () => {

    const token = process.env.TOKEN;
    const secret = process.env.SECRET;
    const host = 'http://' + process.env.HOST;
    const port = process.env.PORT;

    apiClient = new Client({
        token: token,
        secret: secret,
        host: host,
        port: port
    });

    it('should get the signup template for an opportunity', (done) => {

        apiClient.signup.template(1).then((template) => {

            expect(Array.isArray(template.data.data)).to.be.true();
            done();
        });
    });


    it('should handle requesting template for nonexistent opportunity',
    (done) => {

        apiClient.signup.template(10000).catch((result) => {

            const error = result.data.collection.error;

            expect(result.response.statusCode).to.equal(404);

            expect(error).to.deep.equal({
                title: 'Not found',
                code: 404,
                message: 'Signup template not found'
            });

            done();
        });
    });


    it('should submit a signup', (done) => {

        const data = {
            template: {
                data: [
                    { name: 'givenName', value: 'Jon' },
                    { name: 'familyName', value: 'Doe' },
                    { name: 'telephone', value: '5124567890' },
                    { name: 'email', value: 'jon.doe@example.com' },
                    { name: 'comment', value: '' },
                    { name: 'numOfItemsCommitted', value: 1 },
                    { name: 'lead', value: 'other' }
                ]
            }
        };

        apiClient.signup.submit(1, data).then((result) => {

            const status = result.response.statusCode;
            expect(status).to.equal(202);
            done();
        });
    });
});
