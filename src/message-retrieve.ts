import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class MessageRetrieved {
  branch: string
  repoName: string
  repository: string

  constructor(branch: string, repoName: string, gitUrl: string) {
    this.branch = branch
    this.repoName = repoName
    this.repository = gitUrl
  }

  async run(): Promise<any> {
    const clone = `git clone -b ${this.branch} ${this.repository}`
    const gitDir = `./${this.repoName}/.git`
    const commit = `git --no-pager --git-dir=${gitDir} log -1 --pretty=format:"%s"`
    exec
      .exec(clone)
      .then(_ => {
        let myOutput = ''
        let myError = ''

        let options: Record<string, any> = {}
        options.listeners = {
          stdout: (data: Buffer) => {
            myOutput += data.toString()
          },
          stderr: (data: Buffer) => {
            myError += data.toString()
            console.warn('Error in stderr: ', myError)
          }
        }
        exec
          .exec(commit, [], options)
          .then(_ => {
            const match = myOutput.match(/skip ci|ci skip/) ? 'false' : 'true'
            console.log('myOutput: ', myOutput)
            core.setOutput('match', match)
          })
          .catch(e => {
            console.warn('Error in git log command: ', e)
          })
      })
      .catch(e => {
        console.warn('Error in git clone repo: ', e)
      })
  }
}
