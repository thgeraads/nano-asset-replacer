// modal.js
export function createStartupModal() {
    // if (localStorage.getItem('popupShown') === 'true') return;

    const popupModal = document.createElement('div');
    popupModal.className = 'popup-modal';
    Object.assign(popupModal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '9999',
    });

    const modalContainer = document.createElement('div');
    Object.assign(modalContainer.style, {
        borderRadius: '12px',
        width: '75%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative',
    });

    const modalHeader = document.createElement('div');
    modalHeader.innerHTML = `<h1>Please read this before getting started</h1>`;
    Object.assign(modalHeader.style, {
        padding: '10px 30px',
        flex: '0 0 auto',
        backgroundColor: '#121212',
        color: '#b7cad4',
        borderBottom: '2px solid #3E4142'
    });

    const modalBody = document.createElement('div');
    Object.assign(modalBody.style, {
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '0 30px 0 30px',
        backgroundColor: '#121212',
        color: '#b7cad4'
    });

    modalBody.innerHTML = `
        <h2>Important vs All Assets</h2>
        <p>You can show <b>all</b> assets by ticking the "Show all assets" checkbox in the control pane. <b>THIS WILL CLEAR ALL YOUR UPLOADED
        ASSETS</b>. If you intend to swap more assets than are displayed in "simple mode", click that button <b>BEFORE</b> getting
        started. You've been warned.</p>
        <p>Alternatively, you can export a zip archive with your modified assets, and import that after ticking the checkbox.</p>
        
        <h2>Wallpaper Groups</h2>
        <p>The iPod Nano 7th generation has 5 wallpaper types, and comes in 12 colors across 2 revisions.</p>
        <div class="uls">
        <ul>
            <span class='ulTitle'>Wallpaper types</span>
            <li>Solid</li>
            <li>Dotted</li>
            <li>Striped</li>
            <li>Circles</li>
            <li>Neutral</li>
        </ul>
        
        
        <ul>
            <span class='ulTitle'>2012</span>
            <li>Silver</li>
            <li>Blue</li>
            <li>Green</li>
            <li>Yellow</li>
            <li>Pink</li>
            <li>Purple</li>
            <li>Red</li>
            <li>Slate</li>
            <li>Space Gray</li>
        </ul>
        
       
        <ul>
            <span class='ulTitle'>2015</span>
            <li>Silver (Same as 2012)</li>
            <li>Gold</li>
            <li>Space Gray (Same as 2012)</li>
            <li>Blue</li>
            <li>Pink</li>
            <li>Red (Same as 2012)</li>
      </ul>
      </div>
      
      <p>To make theme creation easier, there's an option to sync any wallpaper to all assets contained in its group. 
      This will, for example, replace the solid wallpaper for every color with the wallpaper you've uploaded as well as the lower-resolution preview image,
      used in the iPods' settings app wallpaper picker.
      <b>This will overwrite any other wallpaper uploaded to a different color.</b></p> 
      
        
        <h2>Modifying existing themes</h2>  
        <p>When modifying existing themes, any asset not changed will be reverted to one from the stock OS.
        This is a measure to save server bandwidth and processing time when building IPSWs using a stock base.</p>
        <p>There's an option in the control pane to copy all assets from origin. This will copy every asset from the IPSW you've uploaded instead of using the stock assets. 
        <b>This will overwrite any assets you've uploaded</b>
        </p>
        
        <h2>Building the IPSW</h2>
        <p>Building the IPSW is done serverside and might take some time. If multiple people export at the same time,
        they'll be processed in order. <b>Please be patient with downloads. Don't click that button twice.</b>
        </p>
        
        <p><b>If you get an "Unknown compression type: 8" error, then please use the stock .IPSW from <a
            href="https://github.com/g0lder/NanoVault/tree/main/Stock" target="_blank">here</a></b> or build your own using <a
            href="https://github.com/nfzerox/ipod_theme" target="_blank">ipod_theme</a> or <a href="https://github.com/CUB3D/ipod_sun" target="_blank">ipod_sun</a></p>
        <h3>Consider chipping in so I can maybe get a VPS to process stuff quicker @ <a href="https://ko-fi.com/zeehondie" target="_blank">https://ko-fi.com/zeehondie</a></h3>
    `;

    const modalFooter = document.createElement('div');
    Object.assign(modalFooter.style, {
        flex: '0 0 auto',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '2px solid #3E4142',
        backgroundColor: '#121212',
        color: '#b7cad4'
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Got it!';
    Object.assign(closeBtn.style, {
        padding: '10px 20px',
        border: 'none',
        background: '#007bff',
        color: 'white',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'not-allowed',
        display: 'none'
    });
    closeBtn.disabled = true;

    const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spinner.setAttribute('width', '32');
    spinner.setAttribute('height', '32');
    spinner.setAttribute('viewBox', '0 0 36 36');
    spinner.style.transform = 'rotate(-90deg)';

    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '18');
    bgCircle.setAttribute('cy', '18');
    bgCircle.setAttribute('r', '16');
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#3E4142');
    bgCircle.setAttribute('stroke-width', '4');

    const fgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fgCircle.setAttribute('cx', '18');
    fgCircle.setAttribute('cy', '18');
    fgCircle.setAttribute('r', '16');
    fgCircle.setAttribute('fill', 'none');
    fgCircle.setAttribute('stroke', '#007bff');
    fgCircle.setAttribute('stroke-width', '4');

    const circumference = 2 * Math.PI * 16;
    fgCircle.setAttribute('stroke-dasharray', circumference.toString());
    fgCircle.setAttribute('stroke-dashoffset', circumference.toString());

    spinner.appendChild(bgCircle);
    spinner.appendChild(fgCircle);

    modalFooter.appendChild(spinner);
    modalFooter.appendChild(closeBtn);

    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalContainer.appendChild(modalFooter);
    popupModal.appendChild(modalContainer);
    document.body.appendChild(popupModal);

    modalBody.addEventListener('scroll', () => {
        const scrollTop = modalBody.scrollTop;
        const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight;
        const scrollPercent = scrollTop / scrollHeight;
        const totalLength = 2 * Math.PI * 16;

        fgCircle.setAttribute('stroke-dashoffset', totalLength * (1 - scrollPercent));

        if (scrollPercent >= 0.99) {
            closeBtn.disabled = false;
            spinner.style.display = 'none';
            closeBtn.style.display = 'inline-block';
            closeBtn.style.cursor = 'pointer';
        }
    });

    closeBtn.addEventListener('click', () => {
        localStorage.setItem('popupShown', 'true');
        popupModal.remove();
    });
}
