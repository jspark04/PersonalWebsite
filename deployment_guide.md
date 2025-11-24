# Synology Deployment Guide

This guide will walk you through deploying your personal website to your Synology NAS using **Container Manager** (formerly Docker).

## Prerequisites
1.  **Synology NAS** with Container Manager (or Docker) installed from the Package Center.
2.  **Docker Desktop** installed and running on your Windows PC.
3.  Access to a shared folder on your Synology (e.g., `\docker`) to transfer the image file.

## Method: Manual Image Transfer (No Registry Required)
This is the simplest method for a first-time setup as it doesn't require setting up a Docker Hub account or configuring registry authentication on your NAS.

### Step 1: Build the Image Locally
Open your terminal in VS Code (make sure you are in `e:\repos\PersonalWebsite`) and run:

```powershell
# Build the image with a specific tag
docker build -t john-park-site:latest .
```

### Step 2: Save the Image to a File
Save the built image to a `.tar` file so you can move it to your NAS.

```powershell
# Save the image to a file named 'site.tar'
docker save -o site.tar john-park-site:latest
```

### Step 3: Transfer to Synology
1.  Open File Explorer in Windows.
2.  Navigate to your Synology network share (e.g., `\\YOUR_NAS_IP\docker`).
3.  Copy the `site.tar` file from your project folder to the Synology folder.

### Step 4: Import into Container Manager
1.  Log in to your Synology DSM web interface.
2.  Open **Container Manager** (or Docker).
3.  Go to the **Image** tab.
4.  Click **Action** -> **Import** -> **Add from file**.
5.  Select the `site.tar` file you uploaded.
6.  Click **OK**. You should see `john-park-site:latest` appear in the image list.

### Step 5: Run the Container
1.  Select the `john-park-site:latest` image.
2.  Click **Run**.
3.  **General Settings**:
    - Container Name: `john-park-site`
    - Enable "Enable auto-restart" (optional, but recommended).
4.  **Port Settings**:
    - Local Port: `3000` (or any open port like 8080)
    - Container Port: `3000` (do not change this one)
    - Type: TCP
5.  Click **Next** -> **Done**.

### Step 6: Verify
Open your browser and go to `http://YOUR_NAS_IP:3000`. Your site should be live!

## Updating the Site
To update your site in the future:
1.  Make changes in VS Code.
2.  Re-run the build and save commands (Steps 1 & 2).
3.  Copy the new `site.tar` to Synology.
4.  In Container Manager:
    - Stop and Delete the existing container.
    - Delete the old image.
    - Import the new `site.tar`.
    - Run the new container.

## Troubleshooting
If your site is not loading at your domain (e.g., `jp.maple.myds.me`), follow these steps to isolate the problem.

### 1. Check if the Container is Running
- Go to **Container Manager** -> **Container**.
- Ensure `john-park-site` has a **Green** status.
- If it is stopped, click **Log** to see if there are any error messages.

### 2. Verify Local Access (Bypass Reverse Proxy)
- Try to access the site using your NAS IP address: `http://YOUR_NAS_IP:3000` (or whatever local port you mapped).
- **If this works**: The container is fine. The issue is with the **Reverse Proxy** settings.
- **If this fails**: The container is not running correctly or the port mapping is wrong.

### 3. Check Reverse Proxy Settings
- Go to **Control Panel** -> **Login Portal** -> **Advanced** -> **Reverse Proxy**.
- Select your rule and click **Edit**.
- **Source**:
    - Protocol: `HTTPS`
    - Hostname: `jp.maple.myds.me`
    - Port: `443`
- **Destination**:
    - Protocol: `HTTP`
    - Hostname: `localhost` (or `127.0.0.1`)
    - Port: `3000` (Must match the **Local Port** you set in Step 5.4)

### 4. Check Websocket Headers (Optional but recommended)
- In the Reverse Proxy rule, click **Custom Header**.
- Click **Create** -> **WebSocket**.
- This adds `Upgrade` and `Connection` headers which are sometimes needed.
