let grassContainer = document.querySelector(".grass");

for (let i = 0; i < 80; i++) {
    let grassParticle = document.createElement("div");
    grassParticle.style.width = "7.5px";
    grassParticle.style.height = `${Math.max(20, Math.ceil(Math.random()*40))}px`;
    grassParticle.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    grassParticle.style.left = `${Math.max(5, Math.random()*95)}%`;
    grassParticle.style.top = `${Math.max(5, Math.random()*95)}%`;
    grassParticle.style.zIndex = "-5";
    grassParticle.classList.add("grassParticle");
    grassContainer.append(grassParticle);
};