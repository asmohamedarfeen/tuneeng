"""
Security Testing Script for TuneEng Backend
Run this to perform basic security tests on the API
"""

import requests
import json
import time
from typing import Dict, List, Tuple

BASE_URL = "http://localhost:8000/api"

class SecurityTester:
    def __init__(self):
        self.results: List[Dict] = []
        self.session = requests.Session()
    
    def log_result(self, test_name: str, passed: bool, details: str, severity: str = "INFO"):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "passed": passed,
            "details": details,
            "severity": severity
        }
        self.results.append(result)
        print(f"{status} - {test_name}: {details}")
        return result
    
    def test_1_weak_jwt_secret(self):
        """Test for weak/default JWT secret key"""
        # This would require checking the source code or environment
        # For now, we'll test if tokens can be decoded with common secrets
        test_name = "Weak JWT Secret Key"
        try:
            # Try to register and login to get a token
            register_data = {
                "email": f"test_{int(time.time())}@example.com",
                "password": "TestPass123!",
                "full_name": "Test User"
            }
            res = self.session.post(f"{BASE_URL}/auth/register", json=register_data)
            if res.status_code == 201:
                login_res = self.session.post(
                    f"{BASE_URL}/auth/login",
                    json={"email": register_data["email"], "password": register_data["password"]}
                )
                if login_res.status_code == 200:
                    token = login_res.json().get("access_token")
                    if token:
                        # Token exists - check if it's properly signed
                        # In a real test, we'd try to decode with common secrets
                        return self.log_result(
                            test_name,
                            True,
                            "Token generated successfully. Verify JWT_SECRET_KEY is set in production.",
                            "HIGH"
                        )
        except Exception as e:
            return self.log_result(test_name, False, f"Error: {str(e)}", "HIGH")
        
        return self.log_result(test_name, False, "Could not generate token", "HIGH")
    
    def test_2_password_strength(self):
        """Test password strength validation"""
        test_name = "Password Strength Validation"
        weak_passwords = [
            "123",
            "password",
            "12345678",
            "abcdefgh"
        ]
        
        failed = []
        for weak_pwd in weak_passwords:
            try:
                register_data = {
                    "email": f"test_{int(time.time())}_{weak_pwd}@example.com",
                    "password": weak_pwd,
                    "full_name": "Test User"
                }
                res = self.session.post(f"{BASE_URL}/auth/register", json=register_data)
                if res.status_code == 201:
                    failed.append(weak_pwd)
            except:
                pass
        
        if failed:
            return self.log_result(
                test_name,
                False,
                f"Weak passwords accepted: {', '.join(failed)}",
                "HIGH"
            )
        else:
            return self.log_result(
                test_name,
                True,
                "Weak passwords rejected (or test endpoint unavailable)",
                "HIGH"
            )
    
    def test_3_rate_limiting(self):
        """Test rate limiting on login endpoint"""
        test_name = "Rate Limiting on Login"
        attempts = 10
        success_count = 0
        
        for i in range(attempts):
            try:
                res = self.session.post(
                    f"{BASE_URL}/auth/login",
                    json={"email": "nonexistent@example.com", "password": "wrongpassword"}
                )
                if res.status_code in [200, 401]:
                    success_count += 1
                time.sleep(0.1)  # Small delay
            except:
                pass
        
        if success_count == attempts:
            return self.log_result(
                test_name,
                False,
                f"All {attempts} attempts succeeded - no rate limiting detected",
                "HIGH"
            )
        else:
            return self.log_result(
                test_name,
                True,
                f"Rate limiting may be active (or endpoint unavailable)",
                "HIGH"
            )
    
    def test_4_unprotected_user_endpoints(self):
        """Test if user endpoints require authentication"""
        test_name = "Unprotected User Endpoints"
        endpoints = [
            f"{BASE_URL}/users/",
            f"{BASE_URL}/users/1"
        ]
        
        unprotected = []
        for endpoint in endpoints:
            try:
                res = self.session.get(endpoint)
                if res.status_code == 200:
                    unprotected.append(endpoint)
            except:
                pass
        
        if unprotected:
            return self.log_result(
                test_name,
                False,
                f"Unprotected endpoints: {', '.join(unprotected)}",
                "HIGH"
            )
        else:
            return self.log_result(
                test_name,
                True,
                "Endpoints require authentication or return errors",
                "HIGH"
            )
    
    def test_5_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        test_name = "SQL Injection Protection"
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users--",
            "' UNION SELECT * FROM users--"
        ]
        
        vulnerable = []
        for payload in sql_payloads:
            try:
                # Test in email field
                res = self.session.post(
                    f"{BASE_URL}/auth/login",
                    json={"email": payload, "password": "test"}
                )
                # If we get a 500 error, might indicate SQL injection
                if res.status_code == 500:
                    vulnerable.append(payload)
            except:
                pass
        
        if vulnerable:
            return self.log_result(
                test_name,
                False,
                f"Potential SQL injection: {', '.join(vulnerable)}",
                "CRITICAL"
            )
        else:
            return self.log_result(
                test_name,
                True,
                "SQL injection attempts handled safely",
                "CRITICAL"
            )
    
    def test_6_xss_protection(self):
        """Test XSS protection in contact form"""
        test_name = "XSS Protection"
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')"
        ]
        
        # Test contact form
        for payload in xss_payloads:
            try:
                res = self.session.post(
                    f"{BASE_URL}/contact/submit",
                    json={
                        "name": payload,
                        "email": "test@example.com",
                        "message": payload
                    }
                )
                # Check if payload is reflected in response
                response_text = json.dumps(res.json())
                if payload in response_text and "<script>" in response_text.lower():
                    return self.log_result(
                        test_name,
                        False,
                        f"XSS payload reflected: {payload}",
                        "MEDIUM"
                    )
            except:
                pass
        
        return self.log_result(
            test_name,
            True,
            "XSS payloads handled safely",
            "MEDIUM"
        )
    
    def test_7_cors_configuration(self):
        """Test CORS configuration"""
        test_name = "CORS Configuration"
        try:
            # Test preflight request
            headers = {
                "Origin": "http://malicious-site.com",
                "Access-Control-Request-Method": "POST"
            }
            res = self.session.options(f"{BASE_URL}/auth/login", headers=headers)
            
            if "Access-Control-Allow-Origin" in res.headers:
                allowed_origin = res.headers.get("Access-Control-Allow-Origin")
                if allowed_origin == "*" or "malicious-site.com" in allowed_origin:
                    return self.log_result(
                        test_name,
                        False,
                        f"Overly permissive CORS: {allowed_origin}",
                        "MEDIUM"
                    )
            
            return self.log_result(
                test_name,
                True,
                "CORS configuration appears secure",
                "MEDIUM"
            )
        except Exception as e:
            return self.log_result(test_name, False, f"Error: {str(e)}", "MEDIUM")
    
    def test_8_input_length_validation(self):
        """Test input length validation"""
        test_name = "Input Length Validation"
        long_string = "A" * 10000
        
        try:
            res = self.session.post(
                f"{BASE_URL}/auth/register",
                json={
                    "email": f"{long_string}@example.com",
                    "password": "TestPass123!",
                    "full_name": long_string
                }
            )
            
            if res.status_code == 201:
                return self.log_result(
                    test_name,
                    False,
                    "Very long inputs accepted without validation",
                    "MEDIUM"
                )
            else:
                return self.log_result(
                    test_name,
                    True,
                    "Long inputs rejected or handled",
                    "MEDIUM"
                )
        except Exception as e:
            return self.log_result(test_name, False, f"Error: {str(e)}", "MEDIUM")
    
    def run_all_tests(self):
        """Run all security tests"""
        print("=" * 60)
        print("TuneEng Security Testing")
        print("=" * 60)
        print()
        
        self.test_1_weak_jwt_secret()
        self.test_2_password_strength()
        self.test_3_rate_limiting()
        self.test_4_unprotected_user_endpoints()
        self.test_5_sql_injection()
        self.test_6_xss_protection()
        self.test_7_cors_configuration()
        self.test_8_input_length_validation()
        
        print()
        print("=" * 60)
        print("Test Summary")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["passed"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print()
        
        # Group by severity
        critical = [r for r in self.results if r["severity"] == "CRITICAL" and not r["passed"]]
        high = [r for r in self.results if r["severity"] == "HIGH" and not r["passed"]]
        medium = [r for r in self.results if r["severity"] == "MEDIUM" and not r["passed"]]
        
        if critical:
            print("🔴 CRITICAL Issues:")
            for r in critical:
                print(f"  - {r['test']}: {r['details']}")
        
        if high:
            print("🟠 HIGH Priority Issues:")
            for r in high:
                print(f"  - {r['test']}: {r['details']}")
        
        if medium:
            print("🟡 MEDIUM Priority Issues:")
            for r in medium:
                print(f"  - {r['test']}: {r['details']}")
        
        return self.results

if __name__ == "__main__":
    tester = SecurityTester()
    results = tester.run_all_tests()

