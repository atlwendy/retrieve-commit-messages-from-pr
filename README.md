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
        with:
          token: ${{ secrets.personalAccessToken }}
        uses: atlwendy/retrieve-commit-messages-from-pr@v4
      - name: get my action output
        run: echo ::set-env name=SHOULD_RUN::${{ steps.skipornot.outputs.shouldRun }}
      - name: build
        run: yarn run build
        if: env.SHOULD_RUN == 'true'

```

If the repo is a public accessible repo, you don't need to provide any input. However, if it's a private repo, you'd need to provide a personal access token as input. `GITHUB_TOKEN` is not the correct token. It returns an object with key `shouldRun` and value being a string of boolean.

If last commit messages in a pr contains `skip ci` or `ci skip`, it returns:
```
{ shouldRun: 'false' }
```
This return value can then be assigned to an environment variable and used as condition for following steps.

## Extra - cancel the whole workflow

Perfect cooperation with [andymckay/cancel-action](https://github.com/andymckay/cancel-action).

```
name: Build & Test

on: push

jobs:
  skip-or-not:
    name: skip or not
    runs-on: ubuntu-latest

    steps:
    - name: skip or not
      id: skipornot
      uses: atlwendy/retrieve-commit-messages-from-pr@v4
    - name: output skip or not
      run: echo ::set-env name=SHOULD_RUN::${{ steps.skipornot.outputs.shouldRun }}
    - name: cancelling
      uses: andymckay/cancel-action@0.2
      if: env.SHOULD_RUN == 'false'
    
  build-and-test:   # that job would be skipped
    name: build & test
    runs-on: ubuntu-latest
    needs: [skip-or-not]    # wait for skip-or-not

    steps:    
    - uses: actions/checkout@v1
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 3.1.201
    - name: Build sln
      run: dotnet build -c Release
```