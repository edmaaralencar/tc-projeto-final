import * as cdk from 'aws-cdk-lib'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import { Construct } from 'constructs'

export class EcrStack extends cdk.Stack {
  readonly isCoolGptRepository: ecr.Repository

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    this.isCoolGptRepository = new ecr.Repository(this, 'IsCoolGptService', {
      repositoryName: 'is-cool-gpt-service',
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      emptyOnDelete: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
  }
}
