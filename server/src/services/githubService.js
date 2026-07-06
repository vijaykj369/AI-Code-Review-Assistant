const axios = require('axios');
const env = require('../config/env');

// =========================
// CONFIG
// =========================
const SUPPORTED_EXTENSIONS =
  /\.(js|jsx|ts|tsx|java|py|cpp|c|html|css)$/i;

const IGNORED_DIRECTORIES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  'vendor',
];

const IGNORED_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 2000;

// =========================
// EXTRACT OWNER/REPO
// =========================
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

// =========================
// FETCH FILE TREE
// =========================
const fetchFiles = async (
  owner,
  repo,
  path = ''
) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: env.githubToken
          ? `Bearer ${env.githubToken}`
          : undefined,
        Accept: 'application/vnd.github+json',
      },
    }
  );

  const items = response.data;

  let files = [];

  for (const item of items) {
    // Ignore folders
    if (
      item.type === 'dir' &&
      IGNORED_DIRECTORIES.includes(item.name)
    ) {
      continue;
    }

    // Recursive traversal
    if (item.type === 'dir') {
      const nested = await fetchFiles(
        owner,
        repo,
        item.path
      );

      files.push(...nested);
    }

    // Source files only
    else if (
      item.type === 'file' &&
      SUPPORTED_EXTENSIONS.test(item.name) &&
      !IGNORED_FILES.includes(item.name)
    ) {
      try {
        // Use GitHub API instead of download_url
        const fileResponse = await axios.get(
          item.url,
          {
            headers: {
              Authorization: env.githubToken
                ? `Bearer ${env.githubToken}`
                : undefined,
              Accept:
                'application/vnd.github.raw',
            },
          }
        );

        const content =
          typeof fileResponse.data ===
          'string'
            ? fileResponse.data.slice(
                0,
                MAX_FILE_SIZE
              )
            : '';

        if (content.length > 0) {
          files.push({
            path: item.path,
            content,
            size: content.length,
          });
        }
      } catch (err) {
        console.error(
          `Failed to fetch ${item.path}`
        );

        console.error(
          err.response?.status,
          err.response?.data
        );
      }
    }
  }

  return files;
};

// =========================
// PUBLIC API
// =========================
const getRepositoryFiles = async (
  repoUrl
) => {
  const { owner, repo } =
    extractRepoInfo(repoUrl);

  let files = await fetchFiles(
    owner,
    repo
  );

  // =========================
// PRIORITIZE IMPORTANT FILES
// =========================
const PRIORITY = [
  '/services/',
  '/controllers/',
  '/models/',
  '/middleware/',
  '/routes/',
  '/context/',
  '/hooks/',
  '/pages/',
];

const getPriority = (path) => {
  for (let i = 0; i < PRIORITY.length; i++) {
    if (path.includes(PRIORITY[i])) {
      return PRIORITY.length - i;
    }
  }

  return 0;
};

// prioritize architecture files
files.sort((a, b) => {
  const pa = getPriority(a.path);
  const pb = getPriority(b.path);

  if (pa !== pb) {
    return pb - pa;
  }

  return b.size - a.size;
});

// keep only top files
files = files.slice(0, MAX_FILES);

  console.log(
    `📁 Fetched ${files.length} files`
  );

  console.log(
    'Files:',
    files.map(
      (f) =>
        `${f.path} (${f.size} chars)`
    )
  );

  return files;
};

module.exports = {
  extractRepoInfo,
  getRepositoryFiles,
};