/**
 * Helper Utilities
 */

export const UI = {
    /**
     * Show a Bootstrap toast notification
     * @param {string} title 
     * @param {string} message 
     * @param {string} type 'success', 'danger', 'warning', 'info'
     */
    showToast: (title, message, type = 'info') => {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const id = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(id);
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        toast.show();
        
        // Remove from DOM after it's hidden
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    },

    /**
     * Set loading state of a button
     */
    setButtonLoading: (buttonId, isLoading, originalText = 'Save') => {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
};

export const ExportHelper = {
    /**
     * Export array of objects to CSV file
     */
    downloadCSV: (data, filename) => {
        if (!data || !data.length) return;
        
        // Extract headers
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // Add headers row
        csvRows.push(headers.join(','));
        
        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
