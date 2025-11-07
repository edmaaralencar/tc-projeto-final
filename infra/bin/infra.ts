#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'

import { ClusterStack } from '../lib/cluster-stack'
import { EcrStack } from '../lib/ecr-stack'
import { GithubOidcRoleStack } from '../lib/github-oidc-role-stack'
import { IsCoolGptServiceStack } from '../lib/isCoolGptService-stack-copy'
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

const ecrStack = new EcrStack(app, 'Ecr', {
  env,
  tags: tagsInfra,
})

const vpcStack = new VpcStack(app, 'Vpc', {
  env,
  tags: tagsInfra,
})

const clusterStack = new ClusterStack(app, 'Cluster', {
  env,
  tags: tagsInfra,
  vpc: vpcStack.vpc,
})
clusterStack.addDependency(vpcStack)

new GithubOidcRoleStack(app, 'GithubOidcRole', {
  env,
  tags: tagsInfra,
})

const isCoolGptServiceStagingStack = new IsCoolGptServiceStack(
  app,
  'IsCoolGptService-Staging',
  {
    env,
    tags: tagsInfra,
    vpc: vpcStack.vpc,
    cluster: clusterStack.cluster,
    repository: ecrStack.isCoolGptRepository,
    envName: 'staging',
  },
)
isCoolGptServiceStagingStack.addDependency(vpcStack)
isCoolGptServiceStagingStack.addDependency(clusterStack)
isCoolGptServiceStagingStack.addDependency(ecrStack)
