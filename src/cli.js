#!/usr/bin/env node

const install = require('./install');
const uninstall = require('./uninstall');
const check = require('./check');

let context = {
  install: false,
  uninstall: false,
  check: false,
  verbose: false,
  help: false,
  folder: process.cwd(),
  hooks: ['post-checkout', 'post-merge', 'post-rebase'],
  cmd: 'npx package-json-changed',
}

readParameters();
setupLogger();
checkParametersConsistency();
executeCommand();

function readParameters() {
  process.argv.slice(2).forEach(param => {
    switch (param) {
      case 'help':
      case '--help':
      case '-h':
        context.help = true;
        break;
      case 'install':
      case 'i':
        context.install = true;
        break;
      case 'uninstall':
      case 'u':
      case 'rm':
        context.uninstall = true;
        break;
      case 'check':
      case 'c':
        context.check = true;
        break;
      case '--verbose':
      case '--debug':
        context.verbose = true;
        break;
      default:
        if (param.startsWith('--hooks=')) {
          context.hooks = param.split('=')[1]?.split(',');
        }
        if (param.startsWith('--folder=')) {
          context.folder = param.split('=')[1];
        }
    }
  });
}

function setupLogger() {
  let verboseLog = function (type, msg) {
    const entry = `${new Date().toISOString()} package-json-changed [${type.padStart(5).toUpperCase()}] ${msg}`;
    console[type](entry);
  }
  let info = function (msg) {
    if (context.verbose) return verboseLog('info', msg);
    return console.info(msg);
  }
  let error = function (msg) {
    if (context.verbose) return verboseLog('error', msg);
    return console.error(msg);
  }
  let debug = function (msg) {
    if (context.verbose) return verboseLog('debug', msg);
  }
  context.logger = { info, error, debug };
}

function checkParametersConsistency() {
  const { install, uninstall, check } = context;
  const commandCount = [install, uninstall, check].map(Number).reduce((acc, val) => acc + val, 0);
  if (commandCount == 0) {
    context.help = true;
  } else if (commandCount > 1) {
    context.logger.error('exactly one of "install", "uninstall", "check" or "help" must be provided.');
    process.exit(-1);
  }
  if ((context.hooks?.length ?? 0) == 0 || context.hooks.some(p => !p)) {
    context.logger.error('verify `--hooks=` right side parameters. Tip: default is `post-checkout,post-merge`.');
    process.exit(-1);
  }
  if (!context.folder) {
    context.logger.error('provided folder is invalid; you can probably completely omit this parameter and it will be fine.');
    process.exit(-1);
  }
}

function executeCommand() {
  if (context.install)
    return install(context);
  if (context.uninstall)
    return uninstall(context);
  if (context.check)
    return check(context);
  if (context.help)
    console.log(`
  npx package-json-changed <command> <args>

  command:
    install (default): insert the checks into git hooks
    uninstall: remove the inserted checks from git hooks
    check: manually run the check (you probably don't need to use this)
    help: see this message

  args:
    --verbose: enables debug messages that might help in error investigations
    --hooks=<comma-separated list of git hooks>: add the checks to these specific hooks. Default is --hooks=post-checkout,post-merge,post-rebase
    --folder=<folder>: absolute path of the root folder of the project to add the checks to (this is generally auto-detected correctly but you may override it here)
  
  See https://github.com/renanmontebelo/package-json-changed for more info.
  `.trim());
}
