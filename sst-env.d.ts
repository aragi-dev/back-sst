/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "CORS_ORIGIN": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "MyApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "MyEmail": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "NEON_DATABASE_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "QrBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}