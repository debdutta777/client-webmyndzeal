# Test the create-order API endpoint
$body = @{
    amount = 199
    appointmentId = "test-appointment-123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/payments/create-order" -Method POST -Body $body -Headers $headers
    Write-Host "Success! Order created:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Host $reader.ReadToEnd()
    }
}
