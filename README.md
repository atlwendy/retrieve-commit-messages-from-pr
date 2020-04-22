# Last Commit in Pull Request

This GitHub action returns `true` if last commit message in a pr contains `skip ci` or `ci skip`.

## Usage

```
name: Last commit message in pr

on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: skip or not
        id: skipornot
        uses: atlwendy/retrieve-commit-messages-from-pr@v1
      - name: get my action output
        run: echo ::set-env name=SHOULD_RUN::${{ steps.skipornot.outputs.match }}
      - name: build
        run: yarn run build
        if: env.SHOULD_RUN == 'true'

```
If last commit messages in a pr contains `skip ci` or `ci skip`, return value is `true`. It can be assigned to an environment variable and used as condition for following steps.