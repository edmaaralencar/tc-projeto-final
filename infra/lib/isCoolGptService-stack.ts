import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

interface IsCoolGptServiceStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
  cluster: ecs.Cluster
  repository: ecr.Repository
}

export class IsCoolGptServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IsCoolGptServiceStackProps) {
    super(scope, id, props)

    const cluster = new ecs.Cluster(this, 'IsCoolGptCluster', {
      vpc: props.vpc,
      clusterName: 'IsCoolGpt',
      containerInsights: true,
    })

    const logDriver = ecs.LogDriver.awsLogs({
      logGroup: new logs.LogGroup(this, 'LogGroup', {
        logGroupName: 'IsCoolGptService',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_MONTH,
      }),
      streamPrefix: 'IsCoolGptService',
    })

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'TaskDefinition',
      {
        cpu: 256,
        memoryLimitMiB: 512,
        family: 'is-cool-gpt-service',
      },
    )

    taskDefinition.addContainer('App', {
      containerName: 'isCoolGptService',
      image: ecs.ContainerImage.fromEcrRepository(
        props.repository,
        'efa691a5d0a6',
      ),
      logging: logDriver,
      portMappings: [
        {
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
    })

    const service = new ecs.FargateService(this, 'IsCoolGptService', {
      serviceName: 'IsCoolGptService',
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
    })
    props.repository.grantPull(taskDefinition.taskRole)

    service.connections.securityGroups[0].addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(3000),
      'Public ingress',
    )
  }
}
