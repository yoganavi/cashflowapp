import { describe, assert, test, beforeAll, afterAll, afterEach } from 'vitest';
import { FetchMock }       from '../mocks';
import Client              from '@/Client';
import { SettingsService } from '@/services/SettingsService';

describe('SettingsService', function () {
    const client = new Client('test_base_url');
    const service = new SettingsService(client);
    const fetchMock = new FetchMock();

    beforeAll(function () {
        fetchMock.init();
    });

    afterAll(function () {
        fetchMock.restore();
    });

    afterEach(function () {
        fetchMock.clearMocks();
    });

    describe('getAll()', function () {
        test('Should fetch all app settings', async function () {
            fetchMock.on({
                method: 'GET',
                url: service.client.buildUrl('/api/settings') + '?q1=123',
                additionalMatcher: (_, config) => {
                    return config?.headers?.['x-test'] === '456';
                },
                replyCode: 200,
                replyBody: { 'test': 'abc' },
            });

            const result = await service.getAll({ 'q1': 123, 'headers': {'x-test': '456'} });

            assert.deepEqual(result, { 'test': 'abc' });
        });
    });

    describe('update()', function () {
        test('Should send bulk app settings update', async function () {
            fetchMock.on({
                method: 'PATCH',
                url: service.client.buildUrl('/api/settings'),
                body: { 'b1': 123 },
                additionalMatcher: (_, config) => {
                    return config?.headers?.['x-test'] === '456';
                },
                replyCode: 200,
                replyBody: { 'test': 'abc' },
            });

            const result = await service.update({ 'b1': 123 }, { 'headers': {'x-test': '456'} });

            assert.deepEqual(result, { 'test': 'abc' });
        });
    });

    describe('testS3()', function () {
        test('Should send S3 connection test request', async function () {
            fetchMock.on({
                method: 'POST',
                url: service.client.buildUrl('/api/settings/test/s3')+ '?q1=123',
                body: { 'filesystem': "storage" },
                additionalMatcher: (_, config) => {
                    return config?.headers?.['x-test'] === '456';
                },
                replyCode: 204,
                replyBody: true,
            });

            const result = await service.testS3("storage", { 'q1': 123, 'headers': {'x-test': '456'} });

            assert.isTrue(result);
        });
    });

    describe('testEmail()', function () {
        test('Should send a test email request', async function () {
            fetchMock.on({
                method: 'POST',
                url: service.client.buildUrl('/api/settings/test/email')+ '?q1=123',
                body: { 'template': "abc", "email": "test@example.com" },
                additionalMatcher: (_, config) => {
                    return config?.headers?.['x-test'] === '456';
                },
                replyCode: 204,
                replyBody: true,
            });

            const result = await service.testEmail("test@example.com", "abc", { "q1": 123, 'headers': {'x-test': '456'} });

            assert.isTrue(result);
        });
    });

    describe('generateAppleClientSecret()', function () {
        test('Should send an Apple OAuth2 client secret request', async function () {
            fetchMock.on({
                method: 'POST',
                url: service.client.buildUrl('/api/settings/apple/generate-client-secret')+ '?q1=123',
                body: {
                    clientId:   "1",
                    teamId:     "2",
                    keyId:      "3",
                    privateKey: "4",
                    duration:   5,
                },
                additionalMatcher: (_, config) => {
                    return config?.headers?.['x-test'] === '456';
                },
                replyCode: 204,
                replyBody: { secret: "test" },
            });

            const result = await service.generateAppleClientSecret(
                "1",
                "2",
                "3",
                "4",
                5,
                { "q1": 123, 'headers': {'x-test': '456'} }
            );

            assert.deepEqual(result, { 'secret': 'test' });
        });
    });
});
