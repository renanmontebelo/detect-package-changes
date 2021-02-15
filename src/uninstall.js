const fs = require('fs');

module.exports = function uninstall({
  logger,
  folder,
  hooks,
  cmd,
}) {
  const searchRegex = new RegExp(`^${cmd}[^\\r\\n]*?$`, 'm');
  if (!fs.existsSync(`${folder}/.git/hooks`)) {
    console.error('.git/hooks/ folder not found');
    process.exit(-1);
  }
  hooks.forEach(hook => {
    const filename = `${folder}/.git/hooks/${hook}`;
    if (fs.existsSync(filename)) {
      let contents = fs.readFileSync(filename).toString().replace(searchRegex, '');
      if (contents.trim().length == 0)
        fs.rmSync(filename);
      else
        fs.writeFileSync(filename, contents);
    }
  });
  logger.info(`updated git hooks (${hooks.join(',')}) successfully.`);
}
