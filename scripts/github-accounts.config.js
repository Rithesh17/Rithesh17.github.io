// github-accounts.config.js
// Configure GitHub accounts to sync data from
// API tokens should be set via environment variables for security
// Example: export GITHUB_TOKEN_RITHESH17=ghp_xxxxx

export const githubAccounts = [
  {
    username: "Rithesh17",
    isDefault: true, // Only one account should be default (for profile data)
    apiToken: process.env.GITHUB_TOKEN_RITHESH17 || "", // Optional: leave empty for public only
    includeRepos: [], // Empty = all repos, or specify: ["SpendWise", "GeneWeaver"]
    fetchRepos: true, // Whether to fetch repositories from this account
    fetchContributions: true // Whether to fetch contributions from this account
  },
  {
    username: "RitheshKumar20",
    isDefault: false,
    apiToken: process.env.GITHUB_TOKEN_RITHESHKUMAR20 || "",
    includeRepos: [],
    fetchRepos: false,
    fetchContributions: true
  }
];

// Optional: Global settings
export const settings = {
  maxRepos: 20, // Maximum repos to display (sorted by stars)
  sortBy: "stars", // "stars" | "updated" | "name"
};
