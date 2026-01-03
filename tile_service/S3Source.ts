import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RangeResponse, Source } from 'pmtiles';

export class S3Source implements Source {
    private s3: S3Client;
    private bucket: string;
    private key: string;

    constructor({ region, bucket, key }: { region: string; bucket: string; key: string }) {
        this.s3 = new S3Client({ region });
        this.bucket = bucket;
        this.key = key;
    }

    getKey() {
        return `s3://${this.bucket}/${this.key}`;
    }

    async getBytes(offset: number, length: number): Promise<RangeResponse> {
        const rangeHeader = `bytes=${offset}-${offset + length - 1}`;

        const cmd = new GetObjectCommand({
            Bucket: this.bucket,
            Key: this.key,
            Range: rangeHeader,
        });

        const resp = await this.s3.send(cmd);

        const chunks: Uint8Array[] = [];
        for await (const chunk of resp.Body as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }

        const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
        const out = new Uint8Array(totalLength);
        let pos = 0;
        for (const c of chunks) {
            out.set(c, pos);
            pos += c.length;
        }

        return {
            data: out.buffer,
            etag: resp.ETag,
        };
    }
}
