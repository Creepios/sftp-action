# sftp-action
This action can (currently only) upload files and directories over sftp with ssh login.

## Inputs

### `host`
**Required** The hostname under which you can reach the server. Default `"localhost"`.

### `port`
**Required** The port under which you can reach the server. Default `22`.

### `username`
**Required** The login name. Default `"root"`.

### `password`
**Required** The login password. Default `"password"`.

### `localPath`
**Required** Path to a local file or directory.

### `remotePath`
**Required** Path to a remote file or directory (Any non existing directory or file will be created).

### `agent`
**Optional** Path to local SSH Agent (key-forwarding).

### `privateKey`
**Optional** Path to key file or directly the key (via secret or paste).

### `privateKeyIsFile`
**Optional** Define if private key is a local file or string. Default `"false"`.

### `passphrase`
**Optional** Define a passphrase for encrypted private keys.

### `additionalPaths`
**Optional** Upload multiple files. type: JSON Object (key/ value). E.g '{"localPath":"remotePath"}'.

### `exclude`
**Optional** Exlcude files and directories when uploading a folder. 
*note: exclude path must be full path..

Example: 

Upload dir: ./rootDir

exlude: '["rootDir/subDir", "rootDir/subDir/file.txt"]'

### `debug`
**Optional** Debug logs.

## Example usage
```
on: [push]

jobs:
  upload_files:
    runs-on: ubuntu-latest
    name: Upload a builded file.
    steps:
    - name: Checkout
      uses: actions/checkout@v2.3.4
    - name: Upload Files
      id: upload
      uses: Creepios/sftp-action@v1.0.3
      with:
        host: '127.0.0.1'
        port: 22
        username: 'root'
        password: 'password'
        localPath: './dist/index.js'
        remotePath: './'
```
