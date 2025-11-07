#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'

import { EcrStack } from '../lib/ecr-stack'

const app = new cdk.App()

const tagsInfra = {
  cost: 'IsCoolGPTInfra',
  team: 'EdmarCesar',
}

const env: cdk.Environment = {
  account: '654654382044',
  region: 'us-east-1',
}

new EcrStack(app, 'Ecr', {
  env,
  tags: tagsInfra,
})
