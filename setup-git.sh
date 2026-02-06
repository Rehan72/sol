#!/bin/bash

# Solar Platform - Git Repository Setup Script
# This script helps you set up separate GitHub repositories for frontend and backend

echo "🚀 Solar Platform - Git Repository Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "${YELLOW}📦 Setting up Backend Repository...${NC}"
cd /home/rehanul.haque@tekmindz.com/Backend-Project/Node.js/fullStack/solar/backend

# Rename branch to main
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Solar Platform Backend API

- NestJS backend with TypeScript
- PostgreSQL database with TypeORM
- JWT authentication
- Zod validation
- Customer and admin modules
- Installation workflow management"

echo -e "${GREEN}✅ Backend repository initialized${NC}"
echo ""

# Frontend Setup
echo -e "${YELLOW}📦 Setting up Frontend Repository...${NC}"
cd /home/rehanul.haque@tekmindz.com/Backend-Project/Node.js/fullStack/solar/frontend

# Check if already has commits
if git log --oneline -1 &> /dev/null; then
    echo "Frontend already has commits. Adding new changes..."
    git add .
    git commit -m "Update: Add comprehensive README and .gitignore

- Updated project documentation
- Added proper .gitignore
- Configured for separate repository"
else
    # Rename branch to main
    git branch -M main
    
    # Add all files
    git add .
    
    # Create initial commit
    git commit -m "Initial commit: Solar Platform Frontend

- React 18 with Vite
- Tailwind CSS with cinematic design
- Framer Motion animations
- Zustand state management
- React Router v6
- Customer and admin portals"
fi

echo -e "${GREEN}✅ Frontend repository initialized${NC}"
echo ""

# Instructions for GitHub
echo "=========================================="
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Create two new repositories on GitHub:"
echo "   - solar-backend"
echo "   - solar-frontend"
echo ""
echo "2. Link and push the backend:"
echo "   cd /home/rehanul.haque@tekmindz.com/Backend-Project/Node.js/fullStack/solar/backend"
echo "   git remote add origin https://github.com/YOUR_USERNAME/solar-backend.git"
echo "   git push -u origin main"
echo ""
echo "3. Link and push the frontend:"
echo "   cd /home/rehanul.haque@tekmindz.com/Backend-Project/Node.js/fullStack/solar/frontend"
echo "   git remote add origin https://github.com/YOUR_USERNAME/solar-frontend.git"
echo "   git push -u origin main"
echo ""
echo -e "${GREEN}🎉 Setup complete! Your repositories are ready to push to GitHub.${NC}"
