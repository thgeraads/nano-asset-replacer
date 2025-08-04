// modal.js
export function createConsentModal() {
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
        width: '55%',
        height: '65%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative',
    });

    const modalHeader = document.createElement('div');
    modalHeader.innerHTML = `<h1>Consent to your data being used for analytics purposes</h1>`;
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
        <h2>I am legally required to ask you</h2>
        <p>
            This app uses analytics to improve the user experience and provide better features based on user behaviour.
            By using this app, you consent to the collection and processing of your data for these purposes.
            <br><br>
            The data collected may include information about your device, app usage patterns, and other relevant metrics.
            Your data will not be used for advertising purposes and will be handled in accordance with applicable data protection laws.
            <br><br>
            <a>What data is collected and how is it used?</a>
</p>
    `;

    const modalFooter = document.createElement('div');
    Object.assign(modalFooter.style, {
        flex: '0 0 auto',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'left',
        gap: '16px',
        alignItems: 'center',
        borderTop: '2px solid #3E4142',
        backgroundColor: '#121212',
        color: '#b7cad4'
    });

    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Accept and close';
    Object.assign(acceptBtn.style, {
        padding: '10px 20px',
        border: 'none',
        background: '#007bff',
        color: 'white',
        borderRadius: '5px',
        fontSize: '16px',
        display: 'inline-block',
        transition: 'background-color 0.1s, color 0.1s',

    });
    acceptBtn.disabled = false;

    const rejectBtn = document.createElement('button');
    rejectBtn.textContent = 'Continue without accepting';
    Object.assign(rejectBtn.style, {
        padding: '10px 20px',
        border: '1px solid #007bff',
        background: 'transparent',
        color: 'white',
        borderRadius: '5px',
        fontSize: '16px',
        display: 'inline-block',
        transition: 'background-color 0.1s, color 0.1s',
    });

    // hover style

    acceptBtn.addEventListener('mouseover', () => {
        acceptBtn.style.backgroundColor = '#0056b3';
        acceptBtn.style.color = 'white';
    });

    acceptBtn.addEventListener('mouseout', () => {
        acceptBtn.style.backgroundColor = '#007bff';
        acceptBtn.style.color = 'white';
    });

    rejectBtn.addEventListener('mouseover', () => {
        rejectBtn.style.backgroundColor = '#007bff';
        rejectBtn.style.color = 'white';
    });

    rejectBtn.addEventListener('mouseout', () => {
        rejectBtn.style.backgroundColor = 'transparent';
        rejectBtn.style.color = 'white';
    });



    rejectBtn.disabled = false;

    // const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // spinner.setAttribute('width', '32');
    // spinner.setAttribute('height', '32');
    // spinner.setAttribute('viewBox', '0 0 36 36');
    // spinner.style.transform = 'rotate(-90deg)';
    //
    // const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // bgCircle.setAttribute('cx', '18');
    // bgCircle.setAttribute('cy', '18');
    // bgCircle.setAttribute('r', '16');
    // bgCircle.setAttribute('fill', 'none');
    // bgCircle.setAttribute('stroke', '#3E4142');
    // bgCircle.setAttribute('stroke-width', '4');
    //
    // const fgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // fgCircle.setAttribute('cx', '18');
    // fgCircle.setAttribute('cy', '18');
    // fgCircle.setAttribute('r', '16');
    // fgCircle.setAttribute('fill', 'none');
    // fgCircle.setAttribute('stroke', '#007bff');
    // fgCircle.setAttribute('stroke-width', '4');
    //
    // const circumference = 2 * Math.PI * 16;
    // fgCircle.setAttribute('stroke-dasharray', circumference.toString());
    // fgCircle.setAttribute('stroke-dashoffset', circumference.toString());
    //
    // spinner.appendChild(bgCircle);
    // spinner.appendChild(fgCircle);
    //
    // modalFooter.appendChild(spinner);
    modalFooter.appendChild(acceptBtn);
    modalFooter.appendChild(rejectBtn);
    //
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalContainer.appendChild(modalFooter);
    popupModal.appendChild(modalContainer);
    document.body.appendChild(popupModal);
    //
    // modalBody.addEventListener('scroll', () => {
    //     const scrollTop = modalBody.scrollTop;
    //     const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight;
    //     const scrollPercent = scrollTop / scrollHeight;
    //     const totalLength = 2 * Math.PI * 16;
    //
    //     fgCircle.setAttribute('stroke-dashoffset', totalLength * (1 - scrollPercent));
    //
    //     if (scrollPercent >= 0.99) {
    //         closeBtn.disabled = false;
    //         spinner.style.display = 'none';
    //         closeBtn.style.display = 'inline-block';
    //         closeBtn.style.cursor = 'pointer';
    //     }
    // });

    closeBtn.addEventListener('click', () => {
        localStorage.setItem('popupShown', 'true');
        popupModal.remove();
    });
}
