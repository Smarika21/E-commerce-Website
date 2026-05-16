
document.addEventListener('DOMContentLoaded', () => {
  
  document.querySelectorAll('.product-img-wrap img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const wrap = this.closest('.product-img-wrap');
      if (!wrap.querySelector('.img-fallback')) {
        const fb = document.createElement('div');
        fb.className = 'img-fallback';
        fb.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
        wrap.insertBefore(fb, wrap.firstChild);
      }
    });
  });

  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const menuToggle  = document.getElementById('menuToggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const searchToggle = document.getElementById('searchToggle');
  const searchBar    = document.getElementById('searchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = document.getElementById('searchInput');

  searchToggle.addEventListener('click', () => {
    searchBar.classList.add('open');
    setTimeout(() => searchInput.focus(), 300);
  });

  searchClose.addEventListener('click', () => {
    searchBar.classList.remove('open');
    searchInput.value = '';
  });
 
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchBar.classList.remove('open');
      searchInput.value = '';
    }
  });
 
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      if (query === '' || name.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const cartToggle  = document.getElementById('cartToggle');
  const cartClose   = document.getElementById('cartClose');
  const cartDrawer  = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCount   = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter  = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  let cart = [];

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = total;
    cartCount.classList.toggle('visible', total > 0);
  }

  function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = '$' + total;
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
      cartFooter.style.display = 'none';
      return;
    }

    cartFooter.style.display = 'block';
    cartItemsEl.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" />
        <div>
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">$${item.price} × ${item.qty}</p>
        </div>
        <button class="cart-item__remove" data-index="${index}">✕</button>
      </div>
    `).join('');
    
    cartItemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.index);
        cart.splice(i, 1);
        renderCart();
        updateCartCount();
        updateCartTotal();
      });
    });

    updateCartTotal();
  }
  
  document.getElementById('productGrid').addEventListener('click', e => {
    const btn = e.target.closest('.quick-add');
    if (!btn) return;

    const name  = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const img   = btn.dataset.img;

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }

    renderCart();
    updateCartCount();
    showToast(`${name} added to bag`);
  });
  
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }
  
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg  = document.getElementById('newsletterMsg');
  const emailInput     = document.getElementById('emailInput');

  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) return;
    
    newsletterMsg.textContent = 'Subscribing…';
    setTimeout(() => {
      newsletterMsg.textContent = `You're in. Welcome to ROVA.`;
      emailInput.value = '';
    }, 900);
  });
  
  const revealEls = document.querySelectorAll('.product-card, .about__text, .about__image, .newsletter');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.65s ease ${i * 0.06}s, transform 0.65s ease ${i * 0.06}s`;
    revealObserver.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
