document.getElementById('actionBtn').addEventListener('click', () => {
  const messageDiv = document.getElementById('message');
  messageDiv.style.display = 'block';
  messageDiv.textContent = `Hello! Extension clicked at ${new Date().toLocaleTimeString()}`;
  
  // Get current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      messageDiv.textContent += `\nCurrent page: ${tabs[0].title}`;
    }
  });
});
