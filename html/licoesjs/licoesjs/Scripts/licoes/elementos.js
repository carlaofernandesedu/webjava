'use strict';

function TrocarImagemLampada() {
    const idImgLampada = "img1";
    const pathImgLampOn = "scripts/licoes/lampon.jpg";
    const pathImgLampOff = "scripts/licoes/lampoff.jpg";
    window.document.getElementById(idImgLampada).src = pathImgLampOn;
}