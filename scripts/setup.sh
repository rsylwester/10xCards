#!/bin/bash

# FlashcardAI Setup Script
# This script automates the initial setup process for FlashcardAI

set -e  # Exit on any error

echo "🤖 FlashcardAI Setup Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js v22.14.0 or later."
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
print_success "Node.js $NODE_VERSION found"

# Check npm
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "npm found"

# Check Docker
if ! command_exists docker; then
    print_warning "Docker is not installed. You'll need Docker for Supabase local development."
    echo "Please install Docker from https://docker.com"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Supabase CLI
if ! command_exists supabase; then
    print_warning "Supabase CLI is not installed."
    echo "Installing Supabase CLI..."
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install supabase/tap/supabase
        else
            print_error "Homebrew not found. Please install Supabase CLI manually:"
            echo "https://supabase.com/docs/guides/cli/getting-started"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
        sudo mv supabase /usr/local/bin/
    else
        print_error "Unsupported OS. Please install Supabase CLI manually:"
        echo "https://supabase.com/docs/guides/cli/getting-started"
        exit 1
    fi
    
    print_success "Supabase CLI installed"
else
    print_success "Supabase CLI found"
fi

# Install npm dependencies
print_status "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Set up environment file
print_status "Setting up environment configuration..."

if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Created .env file from .env.example"
else
    print_warning ".env file already exists, skipping..."
fi

# Start Supabase
print_status "Starting Supabase local development environment..."

# Check if Supabase is already running
if supabase status 2>/dev/null | grep -q "API URL"; then
    print_warning "Supabase is already running"
else
    print_status "Starting Supabase (this may take a few minutes)..."
    supabase start
fi

# Get Supabase credentials
print_status "Getting Supabase credentials..."
SUPABASE_STATUS=$(supabase status)
ANON_KEY=$(echo "$SUPABASE_STATUS" | grep "anon key" | awk '{print $3}')
API_URL=$(echo "$SUPABASE_STATUS" | grep "API URL" | awk '{print $3}')

if [ -z "$ANON_KEY" ] || [ -z "$API_URL" ]; then
    print_error "Failed to get Supabase credentials"
    exit 1
fi

# Update .env file with actual credentials
print_status "Updating .env file with Supabase credentials..."

# Use different approach for macOS and Linux sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|PUBLIC_SUPABASE_URL=.*|PUBLIC_SUPABASE_URL=$API_URL|" .env
    sed -i '' "s|PUBLIC_SUPABASE_ANON_KEY=.*|PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env
else
    sed -i "s|PUBLIC_SUPABASE_URL=.*|PUBLIC_SUPABASE_URL=$API_URL|" .env
    sed -i "s|PUBLIC_SUPABASE_ANON_KEY=.*|PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env
fi

print_success "Environment file updated with Supabase credentials"

# Reset database and run seeds
print_status "Setting up database with demo data..."
supabase db reset
print_success "Database setup complete with demo data"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Visit http://localhost:3000"
echo ""
echo "3. Login with demo account:"
echo -e "   ${GREEN}Email:${NC} demo@example.com"
echo -e "   ${GREEN}Password:${NC} demopass"
echo ""
echo "4. (Optional) Get OpenRouter API key for AI features:"
echo "   - Visit https://openrouter.ai"
echo "   - Create account and generate API key"
echo "   - Add to .env file: OPENROUTER_API_KEY=your_key_here"
echo ""
echo "Useful commands:"
echo -e "  ${BLUE}supabase stop${NC}     - Stop Supabase"
echo -e "  ${BLUE}supabase start${NC}    - Start Supabase"
echo -e "  ${BLUE}supabase status${NC}   - Check Supabase status"
echo -e "  ${BLUE}npm run lint${NC}      - Run code linting"
echo ""
print_success "Happy learning! 📚"