import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class GithubOidcRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const provider = new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })

    const ghPrincipal = new iam.OpenIdConnectPrincipal(provider, {
      StringEquals: {
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
      },
      StringLike: {
        'token.actions.githubusercontent.com:sub': [
          'repo:edmaaralencar/tc-projeto-final:ref:refs/heads/staging',
          // 'repo:YOUR_ORG/YOUR_REPO:ref:refs/tags/*'
        ],
      },
    })

    const role = new iam.Role(this, 'GithubActionsDeployRole', {
      roleName: 'github-actions-ecs-deploy',
      assumedBy: ghPrincipal,
      description: 'Assumed by GitHub Actions via OIDC to deploy to ECS/ECR',
      maxSessionDuration: cdk.Duration.hours(1),
    })

    // 1) Necessário para login no ECR (resource "*")
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'EcrAuthAndDescribe',
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:DescribeRepositories', // pode ficar "*" também
        ],
        resources: ['*'],
      }),
    )

    // 2) Push de imagem escopado ao seu repo
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'EcrPushRepoScoped',
        actions: [
          'ecr:BatchCheckLayerAvailability',
          'ecr:BatchGetImage',
          'ecr:CompleteLayerUpload',
          'ecr:GetDownloadUrlForLayer',
          'ecr:InitiateLayerUpload',
          'ecr:PutImage',
          'ecr:UploadLayerPart',
        ],
        resources: [
          'arn:aws:ecr:us-east-1:654654382044:repository/is-cool-gpt-service',
        ],
      }),
    )

    // role.addToPolicy(
    //   new iam.PolicyStatement({
    //     actions: [
    //       // ECS service update & task definition registration
    //       'ecs:DescribeClusters',
    //       'ecs:DescribeServices',
    //       'ecs:UpdateService',
    //       'ecs:RegisterTaskDefinition',
    //       'ecs:DescribeTaskDefinition',
    //       'ecs:ListTaskDefinitions',
    //       'iam:PassRole', // for task/execution roles referenced by task defs
    //     ],
    //     resources: ['*'], // consider scoping to your cluster/service/roles
    //   }),
    // )
  }
}
