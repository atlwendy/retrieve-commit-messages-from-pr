# Check Last Commit Message in a Pull Request

This GitHub action returns `{ shouldRun: true }` if last commit message in a pr contains `skip ci` or `ci skip`.

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
        uses: atlwendy/retrieve-commit-messages-from-pr@v2
      - name: get my action output
        run: echo ::set-env name=SHOULD_RUN::${{ steps.skipornot.outputs.shouldRun }}
      - name: build
        run: yarn run build
        if: env.SHOULD_RUN == 'true'

```

This action does not need any inputs as it uses github context payload to parse the related branch and repo. It returns an object with key `shouldRun` and value being a string of boolean.

If last commit messages in a pr contains `skip ci` or `ci skip`, it returns:
```
{ shouldRun: 'false' }
```
This return value can then be assigned to an environment variable and used as condition for following steps.
