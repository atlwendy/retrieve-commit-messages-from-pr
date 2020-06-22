import * as core from '@actions/core'
import * as Message from './message-retrieve'

async function run(): Promise<any> {
  const ref = process.env.GITHUB_REF

  try {
    if (!ref.includes('/pull/')) {
      const token = core.getInput('token')
      const userWithRepo = process.env.GITHUB_REPOSITORY

      const repoName = userWithRepo.split('/')[1]
      const branch = ref.replace('refs/heads/', '')
      const repoUrl = `https://github.com/${userWithRepo}.git`

      const message = new Message.MessageRetrieved(
        branch,
        repoName,
        repoUrl,
        token
      )
      return message.execute()
    } else {
      core.setOutput('shouldRun', true.toString())
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
