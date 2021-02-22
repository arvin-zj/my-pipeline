const { Stack, SecretValue } = require('@aws-cdk/core');
const { CdkPipeline, SimpleSynthAction } = require('@aws-cdk/pipelines')

const codepipeline = require('@aws-cdk/aws-codepipeline')
const codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions')

class MyPipelineStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact()
    const cloudAssemblyArtifact = new codepipeline.Artifact()

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'MyAppPipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GitHubOAuthToken'),
        trigger: codepipeline_actions.GitHubTrigger.POLL,
        owner: 'arvin-zj',
        repo: 'my-pipeline.git',
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build'
      })
    })
  }
}

module.exports = { MyPipelineStack }
