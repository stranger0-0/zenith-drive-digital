document.addEventListener('DOMContentLoaded', () => {
  // ===== AOS ANIMATIONS =====
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 120
  });

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ===== MODAL FUNCTIONALITY =====
  const modal = document.getElementById('formModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const openModalBtns = document.querySelectorAll('.open-modal');

  function openModal(serviceType = '') {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (serviceType) {
      document.getElementById('serviceType').value = serviceType;
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if (modal) {
    closeModalBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service || '';
      openModal(service);
    });
  });

  // ===== NAVIGATION ACTIVE LINK =====
  function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'sckelton.html';
    const navItems = document.querySelectorAll('.nav-links li a');
    
    navItems.forEach(item => {
      const itemPage = item.getAttribute('href').split('/').pop();
      if (itemPage === currentPage || 
          (currentPage === '' && itemPage === 'sckelton.html') ||
          (currentPage === 'sckelton.html' && itemPage === 'sckelton.html')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  updateActiveNav();

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        showToast('Failed to send message. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // ===== FETCH LATEST BLOG POSTS =====
  fetchLatestBlogPosts();

  // ===== SCROLL REVEAL ANIMATIONS =====
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY;
    const windowBottom = windowTop + windowHeight;

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top + windowTop;
      const elementBottom = elementTop + element.offsetHeight;

      if (elementBottom >= windowTop && elementTop <= windowBottom) {
        element.classList.add('aos-animate');
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
});


// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}


// ===== FETCH LATEST BLOG POSTS FUNCTION =====
async function fetchLatestBlogPosts() {
  const container = document.getElementById('blog-posts');
  const API_URL = 'https://public-api.wordpress.com/rest/v1.1/sites/zenithdrivedigital.wordpress.com/posts?number=6';

  if (!container) {
    console.warn('No container found with id "blog-posts"');
    return;
  }

  try {
    container.innerHTML = `<p>Loading posts...</p>`;
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error fetching posts: ${response.status}`);

    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      container.innerHTML = `<p>No posts found.</p>`;
      return;
    }

    let postsHTML = '';
    data.posts.forEach(post => {
      const imageUrl = post.featured_image || 'https://via.placeholder.com/600x400?text=No+Image';
      const excerpt = post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '';

      postsHTML += `
        <article class="blog-post">
          <img src="${imageUrl}" alt="${post.title}" />
          <h2><a href="post.html?id=${post.ID}">${post.title}</a></h2>
          <p>${excerpt}</p>
          <small>Published on ${new Date(post.date).toLocaleDateString()}</small>
        </article>
      `;
    });

    container.innerHTML = postsHTML;

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Failed to load blog posts.</p>`;
  }
}
