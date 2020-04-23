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

  async execute(): Promise<void> {
    const clone = `git clone -b ${this.branch} ${this.repository}`
    const gitDir = `./${this.repoName}/.git`
    const commit = `git --no-pager --git-dir=${gitDir} log -1 --pretty=format:"%s"`
    exec
      .exec(clone)
      .then(_ => {
        let myOutput = ''
        let myError = ''

        let options: Record<string, object> = {}
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
            const match = /skip ci|ci skip/.test(myOutput)
            const shouldRun = (!match).toString()
            console.log('match: ', match)
            core.setOutput('shouldRun', shouldRun)
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
