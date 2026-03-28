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
gsap.fromTo(
  ".logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 2,
    delay: 0.5,
  }
);
// Timeline for better control
const tl = gsap.timeline();

// 1. Animate the EventHub text entrance
tl.fromTo(
  ".logo-name",
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 2, delay: 0.5 }
);

// 2. Animate the loading page fading out
tl.to(".loading-page", {
  opacity: 0,
  duration: 1.5,
  delay: 2, // How long to stay on screen before leaving
  onComplete: () => {
    // This line redirects the user to your login page
    window.location.href = "login.html";
  }
});