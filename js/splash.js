$(function() {
    // non-canvas animation
    $("#splash-container").hide().fadeIn(3000);

    $("#splash-title").animate({
        opacity: 1,
        top: "+=20px"
    }, 2000);

    $("#btnSkip").css({ opacity: 0, position: "relative", top: "20px" })
                 .animate({ opacity: 1, top: "0px" }, 1500);

    // canvas animation
    const canvas = document.getElementById("splashCanvas");
    const ctx = canvas.getContext("2d");
    let shipX = -100;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(0, 180);
        ctx.bezierCurveTo(200, 150, 600, 210, 800, 180);
        ctx.strokeStyle = "#2980b9";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#5d4037";
        ctx.fillRect(shipX, 150, 80, 30);
        
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(shipX + 30, 100, 40, 50);
        
        ctx.fillStyle = "#000";
        ctx.fillRect(shipX + 48, 100, 4, 50);

        shipX += 2;
        if (shipX > canvas.width) {
            shipX = -100;
        }
        requestAnimationFrame(animate);
    }
    animate();

    // redirect logic
    const goToIntro = () => {
        window.location.href = "intro.html";
    };

    const autoRedirect = setTimeout(goToIntro, 7000);

    $("#btnSkip").on("click", function() {
        clearTimeout(autoRedirect);
        goToIntro();
    });
});