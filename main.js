const startButton = document.getElementById('startButton');
const pingResult = document.getElementById('ping');
const downloadResult = document.getElementById('download');
const uploadResult = document.getElementById('upload');
const statusDiv = document.getElementById('status');


const downloadFileUrl = 'https://link.testfile.org/100MB'; 
const downloadFileSize = 5 * 1024 * 1024; 


const uploadUrl = 'https://github.com/clicedvly768/fucktest.github.io/blob/main/upload-handler.php';
const uploadDataSize = 2 * 1024 * 1024;

startButton.addEventListener('click', runAllTests);

async function runAllTests() {
    startButton.disabled = true;
    pingResult.textContent = '-';
    downloadResult.textContent = '-';
    uploadResult.textContent = '-';
    statusDiv.textContent = 'Подготовка к тесту...';

    try {
        await measurePing();
        await measureDownloadSpeed();
        await measureUploadSpeed();
        statusDiv.textContent = 'Тест завершен!';
    } catch (error) {
        statusDiv.textContent = `Ошибка: ${error.message}`;
        console.error(error);
    } finally {
        startButton.disabled = false;
    }
}

async function measurePing() {
    statusDiv.textContent = 'Тестирование пинга...';
    const startTime = performance.now();

    await fetch(`${uploadUrl}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    pingResult.textContent = duration;
}

async function measureDownloadSpeed() {
    statusDiv.textContent = 'Тестирование скорости скачивания...';
    const startTime = performance.now();
    const response = await fetch(`${downloadFileUrl}?t=${Date.now()}`);
    await response.blob(); 
    const endTime = performance.now();

    const durationInSeconds = (endTime - startTime) / 1000;
    const speedMbps = (downloadFileSize * 8) / (durationInSeconds * 1000 * 1000);
    
    downloadResult.textContent = speedMbps.toFixed(2); // Округляем до 2 знаков
}

async function measureUploadSpeed() {
    statusDiv.textContent = 'Тестирование скорости загрузки...';
    const randomData = new Blob([new Uint8Array(uploadDataSize)], { type: 'application/octet-stream' });

    const startTime = performance.now();
    await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: randomData
    });
    const endTime = performance.now();

    const durationInSeconds = (endTime - startTime) / 1000;
    const speedMbps = (uploadDataSize * 8) / (durationInSeconds * 1000 * 1000);
    
    uploadResult.textContent = speedMbps.toFixed(2);
}
