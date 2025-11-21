import json, base64, urllib.request, urllib.error

payload = {
    "client": {"name": "Test User", "email": "test@example.com"},
    "items": [{"description": "Desenvolvimento", "value": 150000}],
    "pdf_base64": "dGVzdA==",
    "to_email": "test@example.com"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8000/api/invoice/', data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('STATUS', resp.status)
        print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    try:
        print(e.read().decode())
    except Exception:
        pass
except Exception as e:
    print('REQUEST ERROR', str(e))
