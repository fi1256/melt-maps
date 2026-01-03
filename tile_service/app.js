import { PMTiles } from 'pmtiles';
import { S3Source } from './S3Source';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
};

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: CORS_HEADERS,
            body: '',
        };
    }

    const { tileset, z, x, y_and_extension } = event.pathParameters;
    console.log(process.env.BUCKET_NAME, { tileset, z, x, y_and_extension });

    const [y, extension] = y_and_extension.split('.');

    const zNum = Number(z),
        xNum = Number(x),
        yNum = Number(y);

    const fetchSource = new S3Source({
        region: 'us-east-1',
        bucket: process.env.BUCKET_NAME,
        key: `${tileset}.pmtiles`,
    });

    try {
        const pmtiles = new PMTiles(fetchSource, undefined, (d) => Promise.resolve(d));

        const tile = await pmtiles.getZxy(zNum, xNum, yNum);

        if (!tile) {
            return {
                statusCode: 204,
                headers: CORS_HEADERS,
            };
        }

        const CONTENT_HEADERS = {};

        switch (extension) {
            case 'pbf':
                CONTENT_HEADERS['Content-Type'] = 'application/x-protobuf';
                CONTENT_HEADERS['Content-Encoding'] = 'gzip';
                break;

            case 'png':
                CONTENT_HEADERS['Content-Type'] = 'image/png';
                break;

            default:
                CONTENT_HEADERS['Content-Type'] = 'application/octet-stream';
        }

        return {
            statusCode: 200,
            headers: {
                ...CONTENT_HEADERS,
                ...CORS_HEADERS,
            },
            body: Buffer.from(tile.data).toString('base64'),
            isBase64Encoded: true,
        };
    } catch (err) {
        if (err.name === 'NoSuchKey') {
            return { statusCode: 404, headers: CORS_HEADERS, body: 'Not Found' };
        }
        console.error(err);
        return { statusCode: 500, headers: CORS_HEADERS, body: 'Internal Server Error' };
    }
};
