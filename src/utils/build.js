// utils/build.js
import JSZip from 'jszip';

const apiBaseUrl = 'https://ipswtunnel.zeehondie.net';

export async function buildIPSW(version, modifiedAssets, device, setStatus = () => {}, setLoading = () => {}) {
    if (!modifiedAssets || modifiedAssets.length === 0) {
        alert('No assets modified.');
        return;
    }

    try {
        setLoading(true);
        setStatus(`📤 Uploading modified assets...`);

        const zip = new JSZip();
        for (const img of modifiedAssets) {
            const base64 = img.modifiedDataURL.split(',')[1];
            const binary = atob(base64);
            const uint8Array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                uint8Array[i] = binary.charCodeAt(i);
            }

            zip.file(`${img.fullId}.png`, uint8Array);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        const formData = new FormData();
        formData.append('file', blob, 'modified_assets.zip');

        const uploadRes = await fetch(`${apiBaseUrl}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Upload failed.');

        setStatus(`⚙️ Building IPSW (${version})...`);
        const buildRes = await fetch(`${apiBaseUrl}/build-ipsw/${version}`);
        if (!buildRes.ok) throw new Error('Build failed.');

        const ipswBlob = await buildRes.blob();
        const url = URL.createObjectURL(ipswBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iPod_Nano_Custom_${device}_${version}.ipsw`;
        a.click();
        URL.revokeObjectURL(url);

        setStatus('✅ IPSW ready for download.');
    } catch (err) {
        console.error('Build error:', err);
        setStatus(`❌ Build failed: ${err.message}`);
    } finally {
        setLoading(false);
    }
}
