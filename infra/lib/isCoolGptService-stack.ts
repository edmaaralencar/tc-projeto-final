import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

interface IsCoolGptServiceStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
  repository: ecr.Repository
  cluster: ecs.Cluster
  envName: 'staging' | 'production'
}

export class IsCoolGptServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IsCoolGptServiceStackProps) {
    super(scope, id, props)

    const containerPort = 3000
    const envSuffix = props.envName.toLowerCase()
    const baseName = `IsCoolGptService-${envSuffix}`

    const logDriver = ecs.LogDriver.awsLogs({
      logGroup: new logs.LogGroup(this, `${baseName}-LogGroup`, {
        logGroupName: `/ecs/${baseName}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_MONTH,
      }),
      streamPrefix: baseName,
    })

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${baseName}-TaskDefinition`,
      {
        cpu: 256,
        memoryLimitMiB: 512,
        family: `is-cool-gpt-service-${envSuffix}`,
      },
    )

    taskDefinition.addContainer('App', {
      containerName: `isCoolGptService-${envSuffix}`,
      image: ecs.ContainerImage.fromEcrRepository(
        props.repository,
        '8c6748750ff2',
      ),
      logging: logDriver,
      portMappings: [
        {
          containerPort,
          protocol: ecs.Protocol.TCP,
        },
      ],
    })

    const service = new ecs.FargateService(
      this,
      `${baseName}-IsCoolGptService`,
      {
        serviceName: baseName,
        cluster: props.cluster,
        taskDefinition,
        desiredCount: 1,
        assignPublicIp: true,
      },
    )
    props.repository.grantPull(taskDefinition.taskRole)

    service.connections.securityGroups[0].addIngressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      ec2.Port.tcp(containerPort),
      `Public ingress ${envSuffix}`,
    )
  }
}
