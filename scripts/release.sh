#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VERSION=$1

if [ -z "$VERSION" ]; then
  echo -e "${RED}Usage: ./scripts/release.sh <version>${NC}"
  echo "Example: ./scripts/release.sh 1.0"
  exit 1
fi

TAG="v$VERSION"
ALIAS="v$VERSION.jeremys.be"
DATE=$(date +%Y-%m-%d)
ENTRY_FILE="content/changelog/${DATE}-${TAG}.md"

echo -e "${YELLOW}Creating release $TAG...${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}Error: You have uncommitted changes. Commit or stash them first.${NC}"
  exit 1
fi

# Create and push tag
echo "Creating git tag $TAG..."
git tag "$TAG"
git push origin "$TAG"

# Create GitHub release
echo "Creating GitHub release..."
gh release create "$TAG" --generate-notes

# Wait for Vercel deployment
echo -e "${YELLOW}Waiting for Vercel deployment (30 seconds)...${NC}"
sleep 30

# Get deployment URL and set alias
echo "Setting Vercel alias $ALIAS..."
DEPLOYMENT_URL=$(vercel ls --meta gitCommitRef="$TAG" 2>/dev/null | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
  echo -e "${YELLOW}Could not auto-detect deployment URL.${NC}"
  echo "After deployment completes, run manually:"
  echo "  vercel alias set <deployment-url> $ALIAS"
else
  vercel alias set "$DEPLOYMENT_URL" "$ALIAS"
  echo -e "${GREEN}Alias set: https://$ALIAS${NC}"
fi

# Create changelog entry file
echo "Creating changelog entry: $ENTRY_FILE"
cat > "$ENTRY_FILE" << EOF
---
version: "$VERSION"
url: "https://$ALIAS"
---

Describe what's in this version.
EOF

echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit $ENTRY_FILE with release description"
echo "  2. git add $ENTRY_FILE && git commit -m \"Changelog: v$VERSION\" && git push"
