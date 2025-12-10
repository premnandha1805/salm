import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    print("--- 1. Login as Student ---")
    student_creds = {"email": "premkollepara@gmail.com", "password": "password123", "role": "STUDENT"}
    res = requests.post(f"{BASE_URL}/auth/login", json=student_creds)
    if res.status_code != 200:
        print(f"Student login failed: {res.text}")
        return
    student_token = res.json()["access_token"]
    print("Student logged in successfully.")

    print("\n--- 2. Apply for Leave (Trigger 'Apply' Email) ---")
    headers = {"Authorization": f"Bearer {student_token}"}
    leave_data = {
        "start_date": "2025-12-20",
        "end_date": "2025-12-21",
        "reason": "I have a severe fever and need to visit the hospital (Medical)"
    }
    res = requests.post(f"{BASE_URL}/leaves/", json=leave_data, headers=headers)
    if res.status_code != 200:
        print(f"Apply leave failed: {res.text}")
        return
    leave_id = res.json()["id"]
    print(f"Leave applied successfully. ID: {leave_id}")
    print(">> CHECK INBOX: Faculty (premkollepara@gmail.com) should receive 'New Leave Request'")

    print("\n--- 3. Login as Faculty ---")
    faculty_creds = {"email": "faculty@college.com", "password": "password123", "role": "FACULTY"}
    res = requests.post(f"{BASE_URL}/auth/login", json=faculty_creds)
    if res.status_code != 200:
        print(f"Faculty login failed: {res.text}")
        return
    faculty_token = res.json()["access_token"]
    print("Faculty logged in successfully.")

    print("\n--- 4. Approve Leave (Trigger 'Approved' Email) ---")
    headers = {"Authorization": f"Bearer {faculty_token}"}
    action_data = {"comment": "Get well soon"}
    res = requests.put(f"{BASE_URL}/leaves/{leave_id}/approve", json=action_data, headers=headers)
    if res.status_code != 200:
        print(f"Approve leave failed: {res.text}")
        return
    print(f"Leave {leave_id} approved successfully.")
    print(">> CHECK INBOX: Student (premkollepara@gmail.com) should receive 'Leave Request APPROVED'")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Test execution failed: {e}")
