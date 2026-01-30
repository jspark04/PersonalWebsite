$ErrorActionPreference = "Stop"

$IMAGE_NAME = "hotsoupishot/personal-site"
$TAG = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "Building and pushing $IMAGE_NAME with tag $TAG..."

# Build the image with both tags
docker build -t "$IMAGE_NAME`:$TAG" -t "$IMAGE_NAME`:latest" .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed!"
    exit $LASTEXITCODE
}

# Push specific tag
docker push "$IMAGE_NAME`:$TAG"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker push for tag $TAG failed!"
    exit $LASTEXITCODE
}

# Push latest tag
docker push "$IMAGE_NAME`:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker push for latest tag failed!"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Successfully pushed:"
Write-Host " - $IMAGE_NAME`:$TAG"
Write-Host " - $IMAGE_NAME`:latest"
