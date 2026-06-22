const axios = require('axios');

const extractRepoInfo = (repoUrl) => {
  const cleanUrl = repoUrl
    .replace('https://github.com/', '')
    .replace(/\/$/, '');

  const [owner, repo] = cleanUrl.split('/');

  return {
    owner,
    repo,
  };
};

const getRepositoryFiles = async (repoUrl) => {
  const { owner, repo } = extractRepoInfo(repoUrl);

  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents`
  );

  const files = response.data || [];

  return files.filter(
    (file) =>
      file.type === 'file' &&
      /\.(js|jsx|ts|tsx|java|py|cpp|c)$/i.test(file.name)
  );
};

module.exports = {
  extractRepoInfo,
  getRepositoryFiles,
};