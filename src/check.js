const fs = require('fs');

module.exports = function check({ logger, folder, cmd }) {
  logger.debug(`start folder is ${folder}`);
  if (folder.includes('node_modules')) {
    folder = folder.split('node_modules')[0];
    logger.debug(`found node_modules, now folder is ${folder}`);
  }
  let packageLockFound = false;
  do {
    logger.debug(`searching for package-lock.json in ${folder}`);
    packageLockFound = fs.existsSync(`${folder}/package-lock.json`);
  } while (!packageLockFound && (folder = folder.split('/').slice(0, -1).join('/')) != '/');

  if (packageLockFound)
    logger.debug(`package-lock.json found at ${folder}`);
  else {
    logger.error('package-lock.json not found, skipping package-lock-changed');
    process.exit(-1);
  }

  let mismatch = false;
  const packageJson = require(`${folder}/package.json`);
  const topLevelDependencies = [
    ...Object.keys(packageJson.devDependencies || {}),
    ...Object.keys(packageJson.dependencies || {}),
  ];

  const packageLock = require(`${folder}/package-lock.json`);
  const dependencies = packageLock.dependencies;
  topLevelDependencies.forEach(name => {
    lockedVersion = dependencies[name].version;
    const module = require(`${folder}/node_modules/${name}/package.json`);
    if (module.version != lockedVersion) {
      mismatch = true;
      logger.info(`${name}: expected ${lockedVersion} but found ${module.version}`);
    }
  });
  if (mismatch) {
    logger.info('(!) you might want to run `npm i`.');
  } else {
    logger.debug('no mismatch found, everything OK');
  }
}
