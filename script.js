/* Fills the letters in at the end */
/*logic for jgs animation*/
gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 3.5,
  }
);
gsap.fromTo(".logo-name", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2, delay: 0.5 }); // ← STILL HERE


const tl = gsap.timeline();

// 1. Animate EventHub text sliding up — only once
tl.fromTo(
  ".logo-name",
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 2 },
  "+=1.0"  // ← correct way to add delay in a timeline
);

// 2. Fade to white then redirect
tl.to(".loading-page", {
  backgroundColor: "white",
  opacity: 0,
  duration: 0.9,
  ease: "power2.inOut",
  onComplete: () => {
    document.querySelector(".loading-page").style.display = "none";
    window.location.href = "login.html";
  }
}, "+=1.0");