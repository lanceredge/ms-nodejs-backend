let secretsLoaded = false;

async function injectSecrets() {
  require('dotenv').config();

  secretsLoaded = true;
  return;
}

module.exports = { injectSecrets };
