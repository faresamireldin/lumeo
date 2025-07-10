// js/data.js

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-button');
    const buttonText = document.getElementById('button-text');
    const buttonSpinner = document.getElementById('button-spinner');
    const statusMessage = document.getElementById('status-message');

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            // --- Start the loading state ---
            buttonText.textContent = 'Preparing...';
            buttonSpinner.classList.remove('hidden'); // Show the spinner
            downloadButton.disabled = true;

            statusMessage.textContent = "We're preparing your data. This might take a few moments...";
            statusMessage.classList.remove('hidden');

            // --- Simulate a delay for data preparation ---
            setTimeout(() => {
                // --- Show the success state ---
                buttonText.textContent = 'Download Again';
                buttonSpinner.classList.add('hidden'); // Hide the spinner
                downloadButton.disabled = false;

                statusMessage.innerHTML = `
                    Your data file is ready!<br>
                    <span class="text-xs text-gray-500">(In a real app, a file download would start here)</span>
                `;

            }, 3000); // 3-second delay
        });
    }
});
