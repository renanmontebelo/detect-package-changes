const fs = require('fs');
const { EOL } = require('os');

module.exports = function install({
  verbose,
  logger,
  folder,
  hooks,
  cmd,
}) {
  const searchRegex = new RegExp(`^${cmd}.*?$`, 'm');
  cmd = cmd + ` check` + (verbose ? ' --verbose' : '');
  if (!fs.existsSync(`${folder}/.git/hooks`)) {
    logger.error('.git/hooks/ directory not found; try running it from the project root directory.');
    process.exit(-1);
  }
  hooks.forEach(hook => {
    const filename = `${folder}/.git/hooks/${hook}`;
    if (fs.existsSync(filename)) {
      let contents = fs.readFileSync(filename).toString().replace(searchRegex, cmd);
      if (!contents.includes(cmd)) {
        contents += (contents.length == 0 || contents.slice(-1)[0] == '\n' ? '' : EOL) + cmd + EOL;
      }
      fs.writeFileSync(filename, contents);
    } else {
      fs.writeFileSync(filename, cmd + '\n', { mode: 0o770 });
    }
  });
  logger.info(`updated git hooks (${hooks.join(',')}) successfully.`);
}
