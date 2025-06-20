#!/bin/bash

# Script to sync registry content to ui package __registry__ folder

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Syncing registry content to ui package...${NC}"

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY_DIR="$(dirname "$SCRIPT_DIR")"
UI_REGISTRY_DIR="$REGISTRY_DIR/../ui/__registry__"

# Create the __registry__ directory if it doesn't exist
mkdir -p "$UI_REGISTRY_DIR"

# Copy all content from registry/src to ui/__registry__
echo -e "${BLUE}📁 Copying src folder...${NC}"
cp -r "$REGISTRY_DIR/src/"* "$UI_REGISTRY_DIR/"

# Copy package.json for reference
echo -e "${BLUE}📄 Copying package.json...${NC}"
cp "$REGISTRY_DIR/package.json" "$UI_REGISTRY_DIR/package.json"

# Copy tsconfig.json for reference
echo -e "${BLUE}⚙️  Copying tsconfig.json...${NC}"
cp "$REGISTRY_DIR/tsconfig.json" "$UI_REGISTRY_DIR/tsconfig.json"

echo -e "${GREEN}✅ Registry content synced successfully!${NC}"
echo -e "${GREEN}📍 Synced to: $UI_REGISTRY_DIR${NC}" 