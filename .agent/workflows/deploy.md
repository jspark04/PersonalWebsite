---
description: Full deployment pipeline: Update README, Commit, Push Docker.
---

This workflow automates the entire deployment process for the personal website.

1.  **Update Documentation**:
    Execute the `update_readme` workflow to ensure the documentation is up-to-date with the latest changes.

2.  **Commit Changes**:
    Stage all changes (`git add .`) and commit them with a descriptive message based on the recent modifications.

3.  **Deploy**:
    Execute the `push_docker` workflow to build and push the new Docker image.
