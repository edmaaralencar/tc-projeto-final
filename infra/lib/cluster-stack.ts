import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import { Construct } from 'constructs'

interface ClusterStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
}

export class ClusterStack extends cdk.Stack {
  readonly cluster: ecs.Cluster

  constructor(construct: Construct, id: string, props: ClusterStackProps) {
    super(construct, id, props)

    this.cluster = new ecs.Cluster(this, 'IsCoolGptCluster', {
      vpc: props.vpc,
      clusterName: 'IsCoolGpt',
      containerInsights: true,
    })
  }
}
