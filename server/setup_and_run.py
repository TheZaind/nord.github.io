#!/usr/bin/env python3
"""
Discord Clone Server Setup
Installs dependencies and starts the server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def start_server():
    """Start the Discord Clone server"""
    print("\n🚀 Starting Discord Clone Server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📡 WebSocket enabled for real-time messaging")
    print("📂 File uploads enabled")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        subprocess.call([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("🎮 Discord Clone Server Setup")
    print("=" * 40)
    
    # Install dependencies
    if install_requirements():
        # Start server
        start_server()
    else:
        print("❌ Setup failed. Please check your Python installation.")
        sys.exit(1)
