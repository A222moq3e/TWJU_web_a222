#!/usr/bin/env python3
"""
Student Dashboard CTF Challenge Solver
This script demonstrates how to solve the challenge by exploiting vulnerabilities.
"""

import requests
import json
import sys
import time
from urllib.parse import urljoin

class StudentDashboardSolver:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        
    def register_user(self, username, password, email):
        """Register a new user"""
        url = urljoin(self.base_url, '/api/auth/register')
        data = {
            'username': username,
            'password': password,
            'email': email
        }
        
        response = self.session.post(url, json=data)
        if response.status_code == 201:
            print(f"[+] Successfully registered user: {username}")
            return True
        else:
            print(f"[-] Failed to register user: {response.text}")
            return False
    
    def login(self, username, password):
        """Login with credentials"""
        url = urljoin(self.base_url, '/api/auth/login')
        data = {
            'username': username,
            'password': password
        }
        
        response = self.session.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"[+] Successfully logged in as: {username}")
            return result.get('token')
        else:
            print(f"[-] Failed to login: {response.text}")
            return None
    
    def get_profile(self, token):
        """Get user profile"""
        url = urljoin(self.base_url, '/api/students/profile')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = self.session.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"[-] Failed to get profile: {response.text}")
            return None
    
    def update_profile(self, token, data):
        """Update user profile"""
        url = urljoin(self.base_url, '/api/students/profile')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = self.session.put(url, json=data, headers=headers)
        if response.status_code == 200:
            print(f"[+] Successfully updated profile")
            return response.json()
        else:
            print(f"[-] Failed to update profile: {response.text}")
            return None
    
    def upload_avatar(self, token, file_path):
        """Upload avatar file"""
        url = urljoin(self.base_url, '/api/students/avatar')
        headers = {'Authorization': f'Bearer {token}'}
        
        try:
            with open(file_path, 'rb') as f:
                files = {'avatar': f}
                response = self.session.post(url, files=files, headers=headers)
                
            if response.status_code == 200:
                print(f"[+] Successfully uploaded avatar")
                return response.json()
            else:
                print(f"[-] Failed to upload avatar: {response.text}")
                return None
        except FileNotFoundError:
            print(f"[-] File not found: {file_path}")
            return None
    
    def exploit_vulnerability(self):
        """Main exploitation logic"""
        print("[*] Starting Student Dashboard CTF Challenge Exploitation")
        print(f"[*] Target URL: {self.base_url}")
        
        # Step 1: Register a user
        username = "attacker"
        password = "password123"
        email = "attacker@example.com"
        
        if not self.register_user(username, password, email):
            return False
        
        # Step 2: Login
        token = self.login(username, password)
        if not token:
            return False
        
        # Step 3: Get initial profile
        profile = self.get_profile(token)
        if not profile:
            return False
        
        print(f"[*] Initial profile: {profile}")
        
        # Step 4: Try to exploit vulnerabilities
        # This is where you would implement the actual exploit
        # For example, trying to access admin endpoints, file upload vulnerabilities, etc.
        
        print("[*] Attempting to exploit vulnerabilities...")
        
        # Example: Try to access admin endpoints
        admin_url = urljoin(self.base_url, '/api/admin/users')
        headers = {'Authorization': f'Bearer {token}'}
        response = self.session.get(admin_url, headers=headers)
        
        if response.status_code == 200:
            print(f"[+] Successfully accessed admin endpoint!")
            print(f"[+] Response: {response.text}")
            return True
        else:
            print(f"[-] Admin endpoint access denied: {response.status_code}")
        
        # Example: Try file upload with malicious payload
        # Create a simple test file
        test_file = "test_avatar.png"
        with open(test_file, 'wb') as f:
            f.write(b"PNG fake image data")
        
        upload_result = self.upload_avatar(token, test_file)
        if upload_result:
            print(f"[+] File upload successful: {upload_result}")
        
        # Clean up
        import os
        if os.path.exists(test_file):
            os.remove(test_file)
        
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python solve.py <target_url>")
        print("Example: python solve.py http://localhost:5000")
        sys.exit(1)
    
    target_url = sys.argv[1]
    solver = StudentDashboardSolver(target_url)
    
    if solver.exploit_vulnerability():
        print("[+] Challenge solved successfully!")
    else:
        print("[-] Challenge not solved. Try different approaches.")

if __name__ == "__main__":
    main()
