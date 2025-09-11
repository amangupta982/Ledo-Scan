// Highlight active nav link based on current page
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar ul li a");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

// Smooth scroll for internal links (optional)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Example: Button click alert (you can replace with real functionality later)
document.querySelectorAll(".btn-primary").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("🚀 Thanks for getting started with LedoScan!");
  });
});