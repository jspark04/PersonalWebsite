---
description: Build and push the Docker image to Docker Hub
---

This workflow automates the process of building and pushing the personal website Docker image.

1. Run the PowerShell script to build and push the image.
   // turbo
   powershell -ExecutionPolicy Bypass -File .\push_image.ps1
