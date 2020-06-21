import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Message from './message-retrieve'

async function run(): Promise<any> {
  const token = core.getInput('token')
  const userWithRepo = process.env.GITHUB_REPOSITORY
  const ref = process.env.GITHUB_REF

  const repoName = userWithRepo.split('/')[1]
  const branch = ref.replace('refs/heads/', '')
  const repoUrl = `https://github.com/${userWithRepo}.git`
  console.log(
    'process.env, branch, repoName, repoUrl: ',
    process.env,
    branch,
    repoName,
    repoUrl
  )
  try {
    if (branch && repoUrl) {
      const message = new Message.MessageRetrieved(
        branch,
        repoName,
        repoUrl,
        token
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
