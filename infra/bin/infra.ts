#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'

import { EcrStack } from '../lib/ecr-stack'
import { IsCoolGptServiceStack } from '../lib/isCoolGptService-stack'
import { VpcStack } from '../lib/vpc-stack'

const app = new cdk.App()

const tagsInfra = {
  cost: 'IsCoolGPTInfra',
  team: 'EdmarCesar',
}

const env: cdk.Environment = {
  account: '654654382044',
  region: 'us-east-1',
}

const ecr = new EcrStack(app, 'Ecr', {
  env,
  tags: tagsInfra,
})

const vpcStack = new VpcStack(app, 'Vpc', {
  env,
  tags: tagsInfra,
})

new IsCoolGptServiceStack(app, 'IsCoolGptService', {
  tags: tagsInfra,
  env,
  repository: ecr.isCoolGptRepository,
  vpc: vpcStack.vpc,
})
