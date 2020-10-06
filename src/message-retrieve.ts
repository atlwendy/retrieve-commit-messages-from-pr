import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class MessageRetrieved {
  branch: string
  repoName: string
  repository: string
  token: string
  input?: string

  constructor(
    branch: string,
    repoName: string,
    gitUrl: string,
    token: string,
    input?: string
  ) {
    this.branch = branch
    this.repoName = repoName
    this.repository = gitUrl
    this.token = token
    this.input = input
  }

  async execute(): Promise<void> {
    const extra = '@'
    const cloneUrlWithToken =
      this.repository.slice(0, 8) +
      this.token +
      extra +
      this.repository.slice(8)
    const clone = `git clone -b ${this.branch} ${cloneUrlWithToken}`
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
            core.warning('Error in stderr: ${myError}')
          }
        }
        exec
          .exec(commit, [], options)
          .then(_ => {
            const regEx = new RegExp(this.input, 'g')
            const match =
              this.input.length > 0
                ? myOutput.match(regEx)
                : /skip ci|ci skip/.test(myOutput)
            const shouldRun = (!match).toString()
            console.log('match: ', match)
            core.setOutput('shouldRun', shouldRun)
          })
          .catch(e => {
            core.warning('Error in git log command: ${e}')
          })
      })
      .catch(e => {
        core.warning('Error in git clone repo: ${e}')
      })
  }
}
