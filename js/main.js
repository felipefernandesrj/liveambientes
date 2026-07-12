// LIVE AMBIENTES — interações

document.addEventListener('DOMContentLoaded', () => {

  // Header: transição ao rolar
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks && header) {
    const toggleMenu = () => {
      navLinks.classList.toggle('open');
      header.classList.toggle('menu-open');
      navToggle.classList.toggle('open');
    };
    const closeMenu = () => {
      navLinks.classList.remove('open');
      header.classList.remove('menu-open');
      navToggle.classList.remove('open');
    };
    navToggle.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Máscara de telefone (21) 96707-9559
  const applyPhoneMask = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (digits.length <= 2) return ddd.length ? `(${ddd}` : '';
    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    const split = rest.length >= 9 ? 5 : 4;
    return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
  };
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      input.value = applyPhoneMask(input.value);
      input.setSelectionRange(input.value.length, input.value.length);
    });
  });

  // WhatsApp flutuante
  const whatsappWidget = document.getElementById('whatsappWidget');
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappWidget && whatsappBtn) {
    whatsappBtn.addEventListener('click', () => whatsappWidget.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!whatsappWidget.contains(e.target)) whatsappWidget.classList.remove('open');
    });

    // Evita sobrepor os ícones sociais do rodapé
    const footer = document.querySelector('.site-footer');
    if (footer) {
      const avoidFooterOverlap = () => {
        const footerRect = footer.getBoundingClientRect();
        const overlap = window.innerHeight - footerRect.top;
        whatsappWidget.style.bottom = overlap > 0 ? `${overlap + 24}px` : '24px';
      };
      avoidFooterOverlap();
      window.addEventListener('scroll', avoidFooterOverlap, { passive: true });
      window.addEventListener('resize', avoidFooterOverlap);
    }
  }

  // Toasts de notificação (glassmorphism, identidade do site)
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  const toastIcons = {
    success: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
  };

  const showToast = (message, { type = 'success', title, duration = 5000 } = {}) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${toastIcons[type] || toastIcons.success}</span>
      <span class="toast-body">
        <span class="toast-title">${title || (type === 'error' ? 'Não foi possível enviar' : 'Enviado com sucesso')}</span>
        <span class="toast-message">${message}</span>
      </span>
      <button class="toast-close" type="button" aria-label="Fechar">&times;</button>
      <span class="toast-countdown" style="animation-duration:${duration}ms"></span>
    `;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(timeoutId);
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 350);
    };
    const timeoutId = setTimeout(dismiss, duration);
    toast.querySelector('.toast-close').addEventListener('click', dismiss);
  };

  // Envio de formulários pro backend (send-form.php)
  const submitForm = async (form, { successMessage, submitBtn }) => {
    const originalLabel = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }
    try {
      const res = await fetch('send-form.php', { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao enviar');
      showToast(successMessage, { type: 'success' });
      form.reset();
      return true;
    } catch (err) {
      showToast('Tente novamente em instantes ou fale pelo WhatsApp.', { type: 'error' });
      return false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  };

  // Formulário de contato
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(form, {
        successMessage: 'Mensagem enviada com sucesso! Em breve entraremos em contato.',
        submitBtn: form.querySelector('button[type="submit"]'),
      });
    });
  }

  // Formulário de orçamento
  const quoteForm = document.getElementById('quoteForm');
  const quotePlanta = document.getElementById('quotePlanta');
  const quotePlantaName = document.getElementById('quotePlantaName');
  if (quotePlanta && quotePlantaName) {
    quotePlanta.addEventListener('change', () => {
      quotePlantaName.textContent = quotePlanta.files.length
        ? quotePlanta.files[0].name
        : 'Nenhum arquivo selecionado';
    });
  }
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(quoteForm, {
        successMessage: 'Orçamento solicitado com sucesso! Nossa equipe vai analisar os detalhes e entrar em contato.',
        submitBtn: quoteForm.querySelector('button[type="submit"]'),
      }).then((sent) => {
        if (sent && quotePlantaName) quotePlantaName.textContent = 'Nenhum arquivo selecionado';
      });
    });
  }

  // Lightbox da galeria de ambientes
  const triggers = document.querySelectorAll('.lightbox-trigger');
  if (triggers.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Fechar">&times;</button><img class="lightbox-img" alt="">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    const openLightbox = (src, alt) => {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const img = trigger.querySelector('img');
        openLightbox(trigger.getAttribute('href'), img ? img.alt : '');
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  // Newsletter
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(newsletterForm, {
        successMessage: 'Inscrição confirmada! Fique de olho no seu e-mail para o cupom de 15%.',
        submitBtn: newsletterForm.querySelector('button'),
      });
    });
  }
});
