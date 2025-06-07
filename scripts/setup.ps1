# FlashcardAI Setup Script for Windows PowerShell
# This script automates the initial setup process for FlashcardAI

$ErrorActionPreference = "Stop"

Write-Host "🤖 FlashcardAI Setup Script (Windows)" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host ""

# Function to print colored output
function Write-Status($message) {
    Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Status "Checking prerequisites..."

# Check Node.js
if (-not (Test-Command "node")) {
    Write-Error "Node.js is not installed. Please install Node.js v22.14.0 or later."
    Write-Host "Download from: https://nodejs.org/"
    exit 1
}

$nodeVersion = node --version
Write-Success "Node.js $nodeVersion found"

# Check npm
if (-not (Test-Command "npm")) {
    Write-Error "npm is not installed. Please install npm."
    exit 1
}

Write-Success "npm found"

# Check Docker
if (-not (Test-Command "docker")) {
    Write-Warning "Docker is not installed. You'll need Docker for Supabase local development."
    Write-Host "Please install Docker Desktop from https://docker.com"
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Check Supabase CLI
if (-not (Test-Command "supabase")) {
    Write-Warning "Supabase CLI is not installed."
    Write-Host "Please install Supabase CLI manually:"
    Write-Host "1. Download from: https://github.com/supabase/cli/releases/latest"
    Write-Host "2. Extract supabase.exe to a folder in your PATH"
    Write-Host "3. Or use: winget install Supabase.CLI"
    exit 1
}

Write-Success "Supabase CLI found"

# Install npm dependencies
Write-Status "Installing npm dependencies..."
npm install
Write-Success "Dependencies installed"

# Set up environment file
Write-Status "Setting up environment configuration..."

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Success "Created .env file from .env.example"
}
else {
    Write-Warning ".env file already exists, skipping..."
}

# Start Supabase
Write-Status "Starting Supabase local development environment..."

# Check if Supabase is already running
try {
    $status = supabase status 2>$null
    if ($status -match "API URL") {
        Write-Warning "Supabase is already running"
    }
    else {
        throw "Not running"
    }
}
catch {
    Write-Status "Starting Supabase (this may take a few minutes)..."
    supabase start
}

# Get Supabase credentials
Write-Status "Getting Supabase credentials..."
$supabaseStatus = supabase status

# Extract credentials using regex
$anonKey = ($supabaseStatus | Select-String "anon key\s+(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value }).Trim()
$apiUrl = ($supabaseStatus | Select-String "API URL\s+(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value }).Trim()

if (-not $anonKey -or -not $apiUrl) {
    Write-Error "Failed to get Supabase credentials"
    exit 1
}

# Update .env file with actual credentials
Write-Status "Updating .env file with Supabase credentials..."

$envContent = Get-Content ".env"
$envContent = $envContent -replace "PUBLIC_SUPABASE_URL=.*", "PUBLIC_SUPABASE_URL=$apiUrl"
$envContent = $envContent -replace "PUBLIC_SUPABASE_ANON_KEY=.*", "PUBLIC_SUPABASE_ANON_KEY=$anonKey"
$envContent | Set-Content ".env"

Write-Success "Environment file updated with Supabase credentials"

# Reset database and run seeds
Write-Status "Setting up database with demo data..."
supabase db reset --no-confirm
Write-Success "Database setup complete with demo data"

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start the development server:"
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Visit http://localhost:4321"
Write-Host ""
Write-Host "3. Login with demo account:"
Write-Host "   Email: demo@example.com" -ForegroundColor Green
Write-Host "   Password: demopass" -ForegroundColor Green
Write-Host ""
Write-Host "4. (Optional) Get OpenRouter API key for AI features:"
Write-Host "   - Visit https://openrouter.ai"
Write-Host "   - Create account and generate API key"
Write-Host "   - Add to .env file: OPENROUTER_API_KEY=your_key_here"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  supabase stop     - Stop Supabase" -ForegroundColor Cyan
Write-Host "  supabase start    - Start Supabase" -ForegroundColor Cyan
Write-Host "  supabase status   - Check Supabase status" -ForegroundColor Cyan
Write-Host "  npm run lint      - Run code linting" -ForegroundColor Cyan
Write-Host ""
Write-Success "Happy learning! 📚"