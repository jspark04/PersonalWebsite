---
description: Start the local development server
---

1. Free up port 4321 to ensure a clean start
// turbo
2. Run `Get-NetTCPConnection -LocalPort 4321 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`

3. Start the development server
// turbo
4. Run `cmd /c "npm run dev"`
