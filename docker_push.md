# Docker Build and Push Guide

This repository includes a script to automate the process of building and pushing the Docker image for the personal website.

## Prerequisites

- Docker Desktop installed and running.
- Logged in to Docker Hub:
  ```powershell
  docker login
  ```

## Usage

To build and push the image, simply run the PowerShell script:

```powershell
.\push_image.ps1
```

**Note:** If you encounter execution policy errors, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\push_image.ps1
```

## What the Script Does

1.  **Generates a Tag**: Creates a timestamp-based tag (e.g., `20240129-123000`).
2.  **Builds Image**: Builds the Docker image, tagging it with both the timestamp and `latest`.
3.  **Pushes Image**: Pushes both tags to `hotsoupishot/personal-site` on Docker Hub.

## Workflow

1.  Make changes to your website code.
2.  Run `.\push_image.ps1`.
3.  The new image is now available on Docker Hub as `latest` and with a unique timestamp history.
