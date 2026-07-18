import { S3Client } from "@aws-sdk/client-s3";

/**
 * Neon Object Storage (S3-compatible). Credentials/endpoint/region are
 * auto-loaded by the AWS SDK from the standard AWS_ACCESS_KEY_ID /
 * AWS_SECRET_ACCESS_KEY / AWS_ENDPOINT_URL_S3 / AWS_REGION env vars that
 * Neon injects — nothing to configure here explicitly.
 */
export const s3 = new S3Client({ forcePathStyle: true });
