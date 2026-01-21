#!/bin/bash

# GitHub Sync Script
# Syncs GitHub user data from multiple accounts to site.config.js, repositories.json, and avatar
# Uses github-accounts.config.js for configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Detect if script is in scripts/ folder or project root
if [[ "$(basename "$SCRIPT_DIR")" == "scripts" ]]; then
    ROOT_DIR="$(dirname "$SCRIPT_DIR")"
else
    ROOT_DIR="$SCRIPT_DIR"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CONFIG_PATH="$ROOT_DIR/scripts/github-accounts.config.js"

# Check if config file exists
if [ ! -f "$CONFIG_PATH" ]; then
    echo -e "${RED}Error: github-accounts.config.js not found.${NC}"
    echo -e "Please create the config file at: $CONFIG_PATH"
    echo -e "See github-accounts.config.js.example for an example."
        exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: node is required but not installed.${NC}"
    exit 1
fi

# Load and validate config using node
echo -e "${BLUE}Loading configuration...${NC}"

# Create a temporary file with CommonJS version of the config
CONFIG_TEMP=$(mktemp)
CONFIG_PATH="$ROOT_DIR/scripts/github-accounts.config.js"

# Transform ES module to CommonJS
sed 's/export const/const/g' "$CONFIG_PATH" > "$CONFIG_TEMP"
echo "" >> "$CONFIG_TEMP"
echo "module.exports = { githubAccounts, settings };" >> "$CONFIG_TEMP"

# Create validation script
VALIDATION_SCRIPT=$(mktemp)
cat > "$VALIDATION_SCRIPT" << 'VALIDATION_EOF'
const fs = require('fs');
const path = require('path');

try {
    const configPath = path.resolve(process.env.CONFIG_TEMP_PATH);
    const config = require(configPath);
    
    const accounts = config.githubAccounts || [];
    const settings = config.settings || {};
    
    const errors = [];
    
    if (!Array.isArray(accounts) || accounts.length === 0) {
        errors.push("githubAccounts must be a non-empty array");
    }
    
    const defaultAccounts = accounts.filter(acc => acc.isDefault === true);
    if (defaultAccounts.length !== 1) {
        errors.push(`Exactly one account must have isDefault: true (found ${defaultAccounts.length})`);
    }
    
    const usernames = new Set();
    accounts.forEach((account, index) => {
        if (!account.username || typeof account.username !== 'string') {
            errors.push(`Account at index ${index} is missing required field: username`);
        } else {
            if (usernames.has(account.username)) {
                errors.push(`Duplicate username: ${account.username}`);
            }
            usernames.add(account.username);
        }
        
        if (typeof account.isDefault !== 'boolean') {
            errors.push(`Account ${account.username || index} is missing required field: isDefault`);
        }
        
        if (account.apiToken === undefined) {
            errors.push(`Account ${account.username || index} is missing required field: apiToken`);
        }
        
        if (!Array.isArray(account.includeRepos)) {
            errors.push(`Account ${account.username || index} includeRepos must be an array`);
        }
        
        if (typeof account.fetchRepos !== 'boolean') {
            errors.push(`Account ${account.username || index} is missing required field: fetchRepos`);
        }
        
        if (typeof account.fetchContributions !== 'boolean') {
            errors.push(`Account ${account.username || index} is missing required field: fetchContributions`);
        }
    });
    
    if (errors.length > 0) {
        console.error(JSON.stringify({valid: false, errors}));
        process.exit(1);
    }
    
    console.log(JSON.stringify({
        valid: true,
        accounts: accounts.map(acc => ({
            username: acc.username,
            isDefault: acc.isDefault,
            apiToken: acc.apiToken || '',
            includeRepos: acc.includeRepos || [],
            fetchRepos: acc.fetchRepos,
            fetchContributions: acc.fetchContributions
        })),
        settings: {
            maxRepos: settings.maxRepos || 20,
            sortBy: settings.sortBy || 'stars'
        }
    }));
} catch (error) {
    console.error(JSON.stringify({
        valid: false,
        errors: [`Failed to load config: ${error.message}`]
    }));
    process.exit(1);
}
VALIDATION_EOF

export CONFIG_TEMP_PATH="$CONFIG_TEMP"
CONFIG_VALIDATION=$(node "$VALIDATION_SCRIPT" 2>&1)
VALIDATION_EXIT=$?

# Cleanup validation script
rm -f "$VALIDATION_SCRIPT"

# Cleanup temp file (will be cleaned up later after validation check)

if [ $VALIDATION_EXIT -ne 0 ] || echo "$CONFIG_VALIDATION" | jq -e '.valid == false' > /dev/null 2>&1; then
    echo -e "${RED}Error: Invalid configuration${NC}"
    echo "$CONFIG_VALIDATION" | jq -r '.errors[]?' 2>/dev/null || echo "$CONFIG_VALIDATION"
    rm -f "$CONFIG_TEMP"
    exit 1
fi

# Cleanup config temp file now that validation passed
rm -f "$CONFIG_TEMP"

# Extract config data
ACCOUNTS_JSON=$(echo "$CONFIG_VALIDATION" | jq -c '.accounts[]')
MAX_REPOS=$(echo "$CONFIG_VALIDATION" | jq -r '.settings.maxRepos')
SORT_BY=$(echo "$CONFIG_VALIDATION" | jq -r '.settings.sortBy')

# Find default account
DEFAULT_ACCOUNT=$(echo "$ACCOUNTS_JSON" | jq -s '.[] | select(.isDefault == true) | .username' -r | head -1)

echo -e "${GREEN}✓${NC} Configuration loaded"
echo -e "  ${BLUE}Accounts:${NC} $(echo "$ACCOUNTS_JSON" | jq -s 'length')"
echo -e "  ${BLUE}Default account:${NC} $DEFAULT_ACCOUNT"
echo ""

# GitHub API helper function (uses token if available)
github_api() {
    local url="$1"
    local token="$2"
    if [ -n "$token" ]; then
        curl -s -H "Authorization: token $token" "$url"
    else
        curl -s "$url"
    fi
}

# GitHub GraphQL API helper for contributions
github_graphql() {
    local query="$1"
    local token="$2"
    local json_data=$(jq -n --arg query "$query" '{query: $query}')
    
    if [ -n "$token" ]; then
        curl -s -X POST \
            -H "Authorization: bearer $token" \
            -H "Content-Type: application/json" \
            -d "$json_data" \
            "https://api.github.com/graphql"
    else
        curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$json_data" \
            "https://api.github.com/graphql"
    fi
}

# Fetch contributions using GitHub GraphQL API
fetch_contributions_graphql() {
    local username="$1"
    local token="$2"
    
    # Calculate date range (last year)
    local to_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local from_date=$(date -u -v-1y +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "1 year ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # GraphQL query - contributionsCollection automatically includes private contributions
    # when authenticated with a token that has 'repo' and 'read:user' scopes
    local query="{
        user(login: \"$username\") {
            contributionsCollection(from: \"$from_date\", to: \"$to_date\") {
                totalCommitContributions
                restrictedContributionsCount
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                            color
                        }
                    }
                }
            }
        }
    }"
    
    local response=$(github_graphql "$query" "$token")
    
    # Check for errors
    if echo "$response" | jq -e '.errors' > /dev/null 2>&1; then
        local error_msg=$(echo "$response" | jq -r '.errors[0].message // "Unknown error"')
        echo "Error: $error_msg" >&2
        echo "{}"
        return 1
    fi
    
    # Check if user data exists
    if echo "$response" | jq -e '.data.user == null' > /dev/null 2>&1; then
        echo "Error: User not found or token doesn't have access" >&2
        echo "{}"
        return 1
    fi
    
    # Extract contribution days
    # Note: contributionCalendar includes both public and private contributions when authenticated
    local contrib_data=$(echo "$response" | jq -r '.data.user.contributionsCollection.contributionCalendar.weeks[]?.contributionDays[]? | {date: .date, count: .contributionCount, level: (if .contributionCount == 0 then 0 elif .contributionCount < 5 then 1 elif .contributionCount < 10 then 2 elif .contributionCount < 20 then 3 else 4 end)}' | jq -s '.')
    
    # Check if we got valid data
    if [ -z "$contrib_data" ] || [ "$contrib_data" = "[]" ] || [ "$contrib_data" = "null" ]; then
        echo "Error: No contribution data returned" >&2
        echo "{}"
        return 1
    fi
    
    # Log info about private contributions if available
    local restricted_count=$(echo "$response" | jq -r '.data.user.contributionsCollection.restrictedContributionsCount // 0')
    if [ "$restricted_count" != "0" ] && [ "$restricted_count" != "null" ] && [ "$restricted_count" != "" ]; then
        echo "Note: Found $restricted_count restricted (private) contributions" >&2
    fi
    
    echo "$contrib_data"
}

# Fallback: Fetch contributions using public API
fetch_contributions_public() {
    local username="$1"
    local contrib_raw=$(curl -s "https://github-contributions-api.jogruber.de/v4/$username?y=last")
    
    if echo "$contrib_raw" | jq -e '.contributions' > /dev/null 2>&1; then
        echo "$contrib_raw" | jq -r '.contributions[] | {date: .date, count: .count, level: .level}'
    else
        echo "[]"
    fi
}

# Process repositories with language color mapping
get_language_color() {
    local lang="$1"
    case "$lang" in
        "JavaScript") echo "#f1e05a" ;;
        "TypeScript") echo "#3178c6" ;;
        "Python") echo "#3572A5" ;;
        "Java") echo "#b07219" ;;
        "Go") echo "#00ADD8" ;;
        "Rust") echo "#dea584" ;;
        "C++") echo "#f34b7d" ;;
        "C") echo "#555555" ;;
        "C#") echo "#178600" ;;
        "Ruby") echo "#701516" ;;
        "PHP") echo "#4F5D95" ;;
        "Swift") echo "#F05138" ;;
        "Kotlin") echo "#A97BFF" ;;
        "Dart") echo "#00B4AB" ;;
        "HTML") echo "#e34c26" ;;
        "CSS") echo "#563d7c" ;;
        "SCSS") echo "#c6538c" ;;
        "Vue") echo "#41b883" ;;
        "Svelte") echo "#ff3e00" ;;
        "Shell") echo "#89e051" ;;
        *) echo "#6e7681" ;;
    esac
}

# Initialize arrays for merged data
ALL_REPOS_TEMP=$(mktemp)
ALL_CONTRIBS_TEMP=$(mktemp)
ACCOUNTS_TEMP=$(mktemp)
PROFILE_TEMP=$(mktemp)
echo "[]" > "$ALL_REPOS_TEMP"
echo "[]" > "$ALL_CONTRIBS_TEMP"
echo "$ACCOUNTS_JSON" | jq -s '.' > "$ACCOUNTS_TEMP"
echo "{}" > "$PROFILE_TEMP"

# Get account count
ACCOUNT_COUNT=$(echo "$ACCOUNTS_JSON" | jq -s 'length')

# Process each account
ACCOUNT_INDEX=0
while [ $ACCOUNT_INDEX -lt $ACCOUNT_COUNT ]; do
    ACCOUNT_JSON=$(cat "$ACCOUNTS_TEMP" | jq -r ".[$ACCOUNT_INDEX]")
    ACCOUNT_INDEX=$((ACCOUNT_INDEX + 1))
    
    USERNAME=$(echo "$ACCOUNT_JSON" | jq -r '.username')
    IS_DEFAULT=$(echo "$ACCOUNT_JSON" | jq -r '.isDefault')
    API_TOKEN=$(echo "$ACCOUNT_JSON" | jq -r '.apiToken')
    INCLUDE_REPOS=$(echo "$ACCOUNT_JSON" | jq -r '.includeRepos')
    FETCH_REPOS=$(echo "$ACCOUNT_JSON" | jq -r '.fetchRepos')
    FETCH_CONTRIBS=$(echo "$ACCOUNT_JSON" | jq -r '.fetchContributions')
    
    echo -e "${BLUE}Processing account ${ACCOUNT_INDEX}: ${GREEN}@$USERNAME${NC}"
    
    # Fetch profile data for default account only
    if [ "$IS_DEFAULT" = "true" ]; then
        echo -e "  ${YELLOW}Fetching user profile...${NC}"
        USER_DATA=$(github_api "https://api.github.com/users/$USERNAME" "$API_TOKEN")

# Check for API rate limit
if echo "$USER_DATA" | jq -e '.message | test("rate limit")' > /dev/null 2>&1; then
            echo -e "  ${RED}Error: GitHub API rate limit exceeded.${NC}"
            echo -e "  ${YELLOW}Tip: Use a GitHub token to increase rate limits${NC}"
    exit 1
fi

# Check if user exists
if echo "$USER_DATA" | jq -e '.message == "Not Found"' > /dev/null 2>&1; then
            echo -e "  ${RED}Error: GitHub user '$USERNAME' not found.${NC}"
    exit 1
fi

# Extract user info
NAME=$(echo "$USER_DATA" | jq -r '.name // .login')
LOGIN=$(echo "$USER_DATA" | jq -r '.login')
AVATAR_URL=$(echo "$USER_DATA" | jq -r '.avatar_url')
BIO=$(echo "$USER_DATA" | jq -r '.bio // "Software Developer"')
FOLLOWERS=$(echo "$USER_DATA" | jq -r '.followers // 0')
FOLLOWING=$(echo "$USER_DATA" | jq -r '.following // 0')
LOCATION=$(echo "$USER_DATA" | jq -r '.location // ""')
BLOG=$(echo "$USER_DATA" | jq -r '.blog // ""')
COMPANY=$(echo "$USER_DATA" | jq -r '.company // ""')
EMAIL=$(echo "$USER_DATA" | jq -r '.email // ""')
TWITTER=$(echo "$USER_DATA" | jq -r '.twitter_username // ""')

echo -e "  ${GREEN}✓${NC} Found: $NAME (@$LOGIN)"

        # Fetch social accounts
        echo -e "  ${YELLOW}Fetching social accounts...${NC}"
        SOCIAL_DATA=$(github_api "https://api.github.com/users/$USERNAME/social_accounts" "$API_TOKEN")
        
LINKEDIN_URL=""
        SOCIAL_LINKS="[]"

if echo "$SOCIAL_DATA" | jq -e 'type == "array"' > /dev/null 2>&1; then
    LINKEDIN_URL=$(echo "$SOCIAL_DATA" | jq -r '[.[] | select(.provider == "linkedin")] | .[0].url // ""')
    SOCIAL_LINKS=$(echo "$SOCIAL_DATA" | jq -c '[.[] | {provider: .provider, url: .url}]')

    SOCIAL_COUNT=$(echo "$SOCIAL_DATA" | jq 'length')
    if [ "$SOCIAL_COUNT" -gt 0 ]; then
        echo -e "  ${GREEN}✓${NC} Found $SOCIAL_COUNT social links"
    fi
fi

# Download avatar
        echo -e "  ${YELLOW}Downloading avatar...${NC}"
AVATAR_PATH="$ROOT_DIR/static/avatar.jpg"
curl -sL "$AVATAR_URL" -o "$AVATAR_PATH"
        echo -e "  ${GREEN}✓${NC} Avatar saved"
        
        # Save profile data to temp file
        jq -n \
            --arg name "$NAME" \
            --arg login "$LOGIN" \
            --arg bio "$BIO" \
            --arg location "$LOCATION" \
            --arg blog "$BLOG" \
            --arg company "$COMPANY" \
            --arg email "$EMAIL" \
            --arg twitter "$TWITTER" \
            --arg followers "$FOLLOWERS" \
            --arg following "$FOLLOWING" \
            --arg linkedin "$LINKEDIN_URL" \
            --argjson socialLinks "$SOCIAL_LINKS" \
            '{
                name: $name,
                login: $login,
                bio: $bio,
                location: $location,
                blog: $blog,
                company: $company,
                email: $email,
                twitter: $twitter,
                followers: ($followers | tonumber),
                following: ($following | tonumber),
                linkedin: $linkedin,
                socialLinks: $socialLinks
            }' > "$PROFILE_TEMP"
    fi

# Fetch repositories
    if [ "$FETCH_REPOS" = "true" ]; then
        echo -e "  ${YELLOW}Fetching repositories...${NC}"
        REPOS_DATA=$(github_api "https://api.github.com/users/$USERNAME/repos?sort=updated&per_page=100&type=all" "$API_TOKEN")
        
        # Filter repositories based on includeRepos
        INCLUDE_COUNT=$(echo "$INCLUDE_REPOS" | jq 'length')
        if [ "$INCLUDE_COUNT" -gt 0 ]; then
            REPOS_DATA=$(echo "$REPOS_DATA" | jq --argjson include "$INCLUDE_REPOS" '[.[] | select(.name as $name | $include | index($name) != null)]')
        fi
        
        # Process repositories
        REPOS_JSON=$(echo "$REPOS_DATA" | jq -r '.[] | {
    name: .name,
    description: (.description // "No description"),
    language: (.language // "Unknown"),
            languageColor: (if .language == "JavaScript" then "#f1e05a"
      elif .language == "TypeScript" then "#3178c6"
      elif .language == "Python" then "#3572A5"
      elif .language == "Java" then "#b07219"
      elif .language == "Go" then "#00ADD8"
      elif .language == "Rust" then "#dea584"
      elif .language == "C++" then "#f34b7d"
      elif .language == "C" then "#555555"
      elif .language == "C#" then "#178600"
      elif .language == "Ruby" then "#701516"
      elif .language == "PHP" then "#4F5D95"
      elif .language == "Swift" then "#F05138"
      elif .language == "Kotlin" then "#A97BFF"
      elif .language == "Dart" then "#00B4AB"
      elif .language == "HTML" then "#e34c26"
      elif .language == "CSS" then "#563d7c"
      elif .language == "SCSS" then "#c6538c"
      elif .language == "Vue" then "#41b883"
      elif .language == "Svelte" then "#ff3e00"
      elif .language == "Shell" then "#89e051"
      else "#6e7681"
                end),
    stars: .stargazers_count,
    forks: .forks_count,
    isPublic: (.private | not),
    link: .html_url
        }' | jq -s '.')
        
        # Merge with existing repos (deduplicate by link)
        CURRENT_REPOS=$(cat "$ALL_REPOS_TEMP")
        MERGED_REPOS=$(echo "$CURRENT_REPOS" "$REPOS_JSON" | jq -s 'add | unique_by(.link)')
        echo "$MERGED_REPOS" > "$ALL_REPOS_TEMP"

REPO_COUNT=$(echo "$REPOS_JSON" | jq 'length')
echo -e "  ${GREEN}✓${NC} Found $REPO_COUNT repositories"
    fi
    
    # Fetch contributions
    if [ "$FETCH_CONTRIBS" = "true" ]; then
        echo -e "  ${YELLOW}Fetching contributions...${NC}"
        
        # Try GraphQL first (supports private with token)
        CONTRIB_SUCCESS=false
        if [ -n "$API_TOKEN" ]; then
            # Capture both stdout and stderr separately
            CONTRIB_OUTPUT=$(fetch_contributions_graphql "$USERNAME" "$API_TOKEN" 2>&1)
            CONTRIB_EXIT=$?
            
            # Separate errors from data
            CONTRIB_ERRORS=$(echo "$CONTRIB_OUTPUT" | grep -E "^(Error:|Note:)" || true)
            CONTRIB_DAYS=$(echo "$CONTRIB_OUTPUT" | grep -v -E "^(Error:|Note:)" || echo "")
            
            if [ $CONTRIB_EXIT -eq 0 ] && [ -n "$CONTRIB_DAYS" ] && [ "$CONTRIB_DAYS" != "[]" ] && [ "$CONTRIB_DAYS" != "{}" ] && [ "$CONTRIB_DAYS" != "null" ]; then
                # Check if there's an error message
                if echo "$CONTRIB_ERRORS" | grep -q "Error:"; then
                    ERROR_MSG=$(echo "$CONTRIB_ERRORS" | grep "Error:" | head -1 | sed 's/Error: //')
                    echo -e "  ${YELLOW}⚠${NC} $ERROR_MSG"
                    echo -e "  ${YELLOW}Tip:${NC} Ensure token has 'repo' and 'read:user' scopes"
                    echo -e "  ${YELLOW}Tip:${NC} Enable 'Include private contributions' in GitHub Settings → Profile → Contribution settings"
                    # Continue to try public API
                else
                    # Parse the JSON array
                    CONTRIB_ARRAY=$(echo "$CONTRIB_DAYS" | jq -s 'if type == "array" then . else [.] end' 2>/dev/null)
                    if [ -n "$CONTRIB_ARRAY" ] && [ "$CONTRIB_ARRAY" != "[]" ] && [ "$CONTRIB_ARRAY" != "null" ]; then
                        CURRENT_CONTRIBS=$(cat "$ALL_CONTRIBS_TEMP")
                        MERGED_CONTRIBS=$(echo "$CURRENT_CONTRIBS" "$CONTRIB_ARRAY" | jq -s 'add')
                        echo "$MERGED_CONTRIBS" > "$ALL_CONTRIBS_TEMP"
                        # Check for private contributions note
                        if echo "$CONTRIB_ERRORS" | grep -q "restricted"; then
                            PRIVATE_COUNT=$(echo "$CONTRIB_ERRORS" | grep "restricted" | sed 's/Note: Found //' | sed 's/ restricted.*//')
                            echo -e "  ${GREEN}✓${NC} Contributions fetched (includes $PRIVATE_COUNT private contributions)"
                        else
                            echo -e "  ${GREEN}✓${NC} Contributions fetched (with API token - public only)"
                        fi
                        CONTRIB_SUCCESS=true
                    fi
                fi
            elif [ -n "$CONTRIB_ERRORS" ]; then
                # Show error but continue
                ERROR_MSG=$(echo "$CONTRIB_ERRORS" | grep "Error:" | head -1 | sed 's/Error: //' || echo "GraphQL query failed")
                echo -e "  ${YELLOW}⚠${NC} $ERROR_MSG"
            fi
        fi
        
        # Fallback to public API if GraphQL failed
        if [ "$CONTRIB_SUCCESS" = "false" ]; then
            CONTRIB_DAYS=$(fetch_contributions_public "$USERNAME")
            if [ -n "$CONTRIB_DAYS" ] && [ "$CONTRIB_DAYS" != "[]" ]; then
                # Convert line-by-line JSON objects to array
                CONTRIB_ARRAY=$(echo "$CONTRIB_DAYS" | jq -s '.')
                CURRENT_CONTRIBS=$(cat "$ALL_CONTRIBS_TEMP")
                MERGED_CONTRIBS=$(echo "$CURRENT_CONTRIBS" "$CONTRIB_ARRAY" | jq -s 'add')
                echo "$MERGED_CONTRIBS" > "$ALL_CONTRIBS_TEMP"
                echo -e "  ${GREEN}✓${NC} Contributions fetched (public)"
            else
                echo -e "  ${YELLOW}⚠${NC} Could not fetch contributions"
            fi
        fi
    fi
    
    echo ""
done

# Cleanup accounts temp file
rm -f "$ACCOUNTS_TEMP"

# Load profile data from temp file
if [ -f "$PROFILE_TEMP" ] && [ -s "$PROFILE_TEMP" ]; then
    PROFILE_DATA=$(cat "$PROFILE_TEMP")
    NAME=$(echo "$PROFILE_DATA" | jq -r '.name')
    LOGIN=$(echo "$PROFILE_DATA" | jq -r '.login')
    BIO=$(echo "$PROFILE_DATA" | jq -r '.bio')
    LOCATION=$(echo "$PROFILE_DATA" | jq -r '.location')
    BLOG=$(echo "$PROFILE_DATA" | jq -r '.blog')
    COMPANY=$(echo "$PROFILE_DATA" | jq -r '.company')
    EMAIL=$(echo "$PROFILE_DATA" | jq -r '.email')
    TWITTER=$(echo "$PROFILE_DATA" | jq -r '.twitter')
    FOLLOWERS=$(echo "$PROFILE_DATA" | jq -r '.followers')
    FOLLOWING=$(echo "$PROFILE_DATA" | jq -r '.following')
    LINKEDIN_URL=$(echo "$PROFILE_DATA" | jq -r '.linkedin')
    SOCIAL_LINKS=$(echo "$PROFILE_DATA" | jq -c '.socialLinks')
fi

# Finalize repositories: sort and limit
echo -e "${YELLOW}Merging repositories...${NC}"
ALL_REPOS=$(cat "$ALL_REPOS_TEMP")

# Sort by specified field
case "$SORT_BY" in
    "stars")
        SORTED_REPOS=$(echo "$ALL_REPOS" | jq "sort_by(-.stars) | .[0:$MAX_REPOS]")
        ;;
    "updated")
        # Note: We don't have updated date in current structure, fallback to stars
        SORTED_REPOS=$(echo "$ALL_REPOS" | jq "sort_by(-.stars) | .[0:$MAX_REPOS]")
        ;;
    "name")
        SORTED_REPOS=$(echo "$ALL_REPOS" | jq "sort_by(.name) | .[0:$MAX_REPOS]")
        ;;
    *)
        SORTED_REPOS=$(echo "$ALL_REPOS" | jq "sort_by(-.stars) | .[0:$MAX_REPOS]")
        ;;
esac

REPOS_PATH="$ROOT_DIR/static/repositories.json"
echo "$SORTED_REPOS" | jq '.' > "$REPOS_PATH"
FINAL_REPO_COUNT=$(echo "$SORTED_REPOS" | jq 'length')
echo -e "  ${GREEN}✓${NC} Saved $FINAL_REPO_COUNT repositories to static/repositories.json"

# Finalize contributions: merge by date
echo -e "${YELLOW}Merging contributions...${NC}"
ALL_CONTRIBS=$(cat "$ALL_CONTRIBS_TEMP")

# Ensure ALL_CONTRIBS is a flat array and filter out any invalid entries
ALL_CONTRIBS_CLEAN=$(echo "$ALL_CONTRIBS" | jq -s 'flatten | map(select(.date != null and .count != null))')

# Merge contributions by date (sum counts, max level)
SYNC_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    CURRENT_YEAR=$(date +%Y)

CONTRIB_JSON=$(echo "$ALL_CONTRIBS_CLEAN" | jq --arg year "$CURRENT_YEAR" --arg syncDate "$SYNC_DATE" '
    if length == 0 then
        {
            year: ($year | tonumber),
            total: 0,
            lastSynced: $syncDate,
            days: []
        }
    else
        (group_by(.date) |
        map({
            date: .[0].date,
            count: (map(.count | tonumber) | add),
            level: (map(.level | tonumber) | max)
        }) |
        {
        year: ($year | tonumber),
            total: (map(.count) | add),
        lastSynced: $syncDate,
            days: .
        })
    end
')

    CONTRIB_TOTAL=$(echo "$CONTRIB_JSON" | jq '.total')
    CONTRIB_PATH="$ROOT_DIR/static/contributions.json"
    echo "$CONTRIB_JSON" | jq '.' > "$CONTRIB_PATH"
echo -e "  ${GREEN}✓${NC} Found $CONTRIB_TOTAL total contributions"
    echo -e "  ${GREEN}✓${NC} Saved to static/contributions.json"

# Cleanup temp files
rm -f "$ALL_REPOS_TEMP" "$ALL_CONTRIBS_TEMP" "$PROFILE_TEMP"

# Update site.config.js (only for default account)
if [ -n "$NAME" ]; then
echo -e "${YELLOW}Updating site.config.js...${NC}"
CONFIG_PATH="$ROOT_DIR/site.config.js"

if [ ! -f "$CONFIG_PATH" ]; then
    echo -e "${RED}Error: site.config.js not found at $CONFIG_PATH${NC}"
    exit 1
fi

# Export variables for node
export CONFIG_PATH="$CONFIG_PATH"
export GH_NAME="$NAME"
export GH_LOGIN="$LOGIN"
export GH_BIO="$BIO"
export GH_LOCATION="$LOCATION"
export GH_BLOG="$BLOG"
export GH_COMPANY="$COMPANY"
export GH_EMAIL="$EMAIL"
export GH_TWITTER="$TWITTER"
export GH_FOLLOWERS="$FOLLOWERS"
export GH_FOLLOWING="$FOLLOWING"
export GH_LINKEDIN="$LINKEDIN_URL"
export GH_SOCIAL_LINKS="$SOCIAL_LINKS"

    # Use node to update the config
node << 'NODESCRIPT'
const fs = require('fs');
const configPath = process.env.CONFIG_PATH;

const data = {
    name: process.env.GH_NAME || '',
    username: process.env.GH_LOGIN || '',
    bio: process.env.GH_BIO || '',
    location: process.env.GH_LOCATION || '',
    website: process.env.GH_BLOG || '',
    company: process.env.GH_COMPANY || '',
    email: process.env.GH_EMAIL || '',
    twitter: process.env.GH_TWITTER || '',
    linkedin: process.env.GH_LINKEDIN || '',
    followers: parseInt(process.env.GH_FOLLOWERS) || 0,
    following: parseInt(process.env.GH_FOLLOWING) || 0,
    socialLinks: process.env.GH_SOCIAL_LINKS ? JSON.parse(process.env.GH_SOCIAL_LINKS) : []
};

let content = fs.readFileSync(configPath, 'utf8');

function updateField(content, field, value) {
    if (value === 'null' || value === null) value = '';
    const escapedValue = (value || '')
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
    const regex = new RegExp(`(\\s*${field}:\\s*)(['"])[^'"]*\\2`, 'g');
    if (content.match(regex)) {
        return content.replace(regex, `$1'${escapedValue}'`);
    }
    return content;
}

function updateNumericField(content, field, value) {
    const regex = new RegExp(`(\\s*${field}:\\s*)\\d+`, 'g');
    if (content.match(regex)) {
        return content.replace(regex, `$1${value}`);
    }
    return content;
}

function updateArrayField(content, field, value) {
    const arrayStr = JSON.stringify(value, null, 4).replace(/\n/g, '\n    ');
    const regex = new RegExp(`(\\s*${field}:\\s*)\\[[^\\]]*\\]`, 's');
    if (content.match(regex)) {
        return content.replace(regex, `$1${arrayStr}`);
    }
    return content;
}

content = updateField(content, 'name', data.name);
content = updateField(content, 'username', data.username);
content = updateField(content, 'siteTitle', data.name);
content = updateField(content, 'bio', data.bio);
content = updateField(content, 'location', data.location);
content = updateField(content, 'website', data.website);
content = updateField(content, 'company', data.company);
content = updateField(content, 'email', data.email);
content = updateField(content, 'twitter', data.twitter);
content = updateField(content, 'linkedin', data.linkedin);
content = updateNumericField(content, 'followers', data.followers);
content = updateNumericField(content, 'following', data.following);

if (data.socialLinks && data.socialLinks.length > 0) {
    content = updateArrayField(content, 'socialLinks', data.socialLinks);
}

fs.writeFileSync(configPath, content);
NODESCRIPT

echo -e "  ${GREEN}✓${NC} Updated site.config.js"
fi

# Random theme selector
echo -e "${YELLOW}Selecting random theme...${NC}"
INDEX_CSS_PATH="$ROOT_DIR/src/lib/index.css"

THEMES=(
    "black-red.css"
    "black-white.css"
    "blue.css"
    "charcoal.css"
    "cyan.css"
    "green.css"
    "orange.css"
    "pink.css"
    "purple.css"
    "red.css"
)

RANDOM_INDEX=$((RANDOM % ${#THEMES[@]}))
SELECTED_THEME="${THEMES[$RANDOM_INDEX]}"

if [ -f "$INDEX_CSS_PATH" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "3s|@import \"statue-ssg/themes/.*\";|@import \"statue-ssg/themes/${SELECTED_THEME}\";|" "$INDEX_CSS_PATH"
    else
        sed -i "3s|@import \"statue-ssg/themes/.*\";|@import \"statue-ssg/themes/${SELECTED_THEME}\";|" "$INDEX_CSS_PATH"
    fi
    echo -e "  ${GREEN}✓${NC} Theme set to: ${BLUE}${SELECTED_THEME%.css}${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GitHub Sync Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
if [ -n "$NAME" ]; then
echo -e "  ${BLUE}Profile:${NC} $NAME (@$LOGIN)"
echo -e "  ${BLUE}Bio:${NC} $BIO"
echo -e "  ${BLUE}Location:${NC} ${LOCATION:-Not set}"
echo -e "  ${BLUE}Followers:${NC} $FOLLOWERS | ${BLUE}Following:${NC} $FOLLOWING"
fi
echo -e "  ${BLUE}Repos:${NC} $FINAL_REPO_COUNT (top $MAX_REPOS by $SORT_BY saved)"
echo -e "  ${BLUE}Contributions:${NC} ${CONTRIB_TOTAL:-N/A}"
echo -e "  ${BLUE}Theme:${NC} ${SELECTED_THEME%.css}"
echo ""
echo -e "  ${YELLOW}Files synced:${NC}"
echo -e "    - site.config.js"
echo -e "    - static/repositories.json"
echo -e "    - static/contributions.json"
echo -e "    - static/avatar.jpg"
echo -e "    - src/lib/index.css (theme)"
echo ""
