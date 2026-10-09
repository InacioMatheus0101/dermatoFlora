/**
 * DermatoFlora - Script Principal de Interatividades e Conversão
 * Tecnologias: JavaScript Puro (Vanilla JS moderno), acessível e de alta performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes Globais - Dados Reais DermatoFlora
  const WHATSAPP_NUMBER = '5581988067930'; // WhatsApp Oficial da DermatoFlora (Carpina - PE)

  /* ==========================================================================
     1. HEADER SCROLL & NAVEGAÇÃO
     ========================================================================== */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     2. MENU MOBILE DRAWER
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-drawer-link');

  function openMobileMenu() {
    mobileDrawer?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  /* ==========================================================================
     3. MODAL DE ENVIO DE RECEITA (<dialog>) COM UPLOAD E VALIDAÇÃO
     ========================================================================== */
  const modalReceita = document.getElementById('modal-receita');
  const openModalTriggers = document.querySelectorAll('.trigger-prescription-modal');
  const closeModalBtn = document.querySelector('.dialog-close-btn');
  const prescriptionForm = document.getElementById('prescription-form');
  const phoneInput = document.getElementById('client-phone');

  // Funções de Controle do Modal de Receita
  function openPrescriptionModal() {
    if (!modalReceita) return;
    if (!modalReceita.open) {
      modalReceita.showModal();
    }
    const dialogBody = modalReceita.querySelector('.dialog-body');
    if (dialogBody) dialogBody.scrollTop = 0;
    modalReceita.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closePrescriptionModal() {
    if (!modalReceita) return;
    try {
      if (modalReceita.open) {
        modalReceita.close();
      }
    } catch (err) {
      // Ignora erro se o diálogo já estiver fechado
    }
    modalReceita.removeAttribute('open');
    document.body.style.overflow = '';
  }

  openModalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPrescriptionModal();
    });
  });

  closeModalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closePrescriptionModal();
  });

  modalReceita?.addEventListener('click', (e) => {
    const dialogDimensions = modalReceita.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closePrescriptionModal();
    }
  });

  modalReceita?.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });

  modalReceita?.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // Máscara Automática de Telefone: (99) 99999-9999
  phoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      // Celular: (99) 99999-9999
      e.target.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      // Fixo ou celular digitando
      e.target.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      e.target.value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    }
  });

  // Envio Direto da Solicitação com Abertura da Conversa/Câmera no WhatsApp Oficial
  prescriptionForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name')?.value.trim();
    const phone = phoneInput?.value.trim();
    const lineType = document.getElementById('prescription-type')?.value;
    const notes = document.getElementById('client-notes')?.value.trim();

    let msg = `*SOLICITAÇÃO DE ORÇAMENTO - DERMATOFLORA*%0A%0A`;
    msg += `Olá! Gostaria de um orçamento para manipulação médica/veterinária.%0A%0A`;
    msg += `👤 *Nome:* ${encodeURIComponent(name)}%0A`;
    msg += `📱 *WhatsApp:* ${encodeURIComponent(phone)}%0A`;
    msg += `🏷 *Tipo de Fórmula:* ${encodeURIComponent(lineType)}%0A`;
    if (notes) {
      msg += `📝 *Observações:* ${encodeURIComponent(notes)}%0A`;
    }
    msg += `%0A📷 *Foto da Receita:* Enviando a foto/documento da receita médica/veterinária a seguir nesta conversa...`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    const submitBtn = prescriptionForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Abrindo WhatsApp da Farmácia...</span>`;

      // Abertura imediata da conversa oficial
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        closePrescriptionModal();
        prescriptionForm.reset();
      }, 1000);
    }
  });

  /* ==========================================================================
     4. BANCO DE DADOS OFICIAL DE PRODUTOS & LINHAS CONFIRMADAS
     (Rigorosamente baseado no catálogo público oficial DermatoFlora)
     ========================================================================== */
  const OFFICIAL_PRODUCTS_DATA = {
    'psoriase-100g': {
      id: 'psoriase-100g',
      name: 'Creme para Psoríase — 100 g',
      category: 'Tratamento Dermatológico',
      presentation: 'Apresentação: Creme — 100 g',
      badge: 'Tratamento Especializado',
      image: 'assets/images/prod-creme-psoriase.svg',
      descTitle: 'Descrição Oficial DermatoFlora',
      description: 'Creme para Psoríase 100 g, desenvolvido pela Dermatoflora para auxiliar no controle da psoríase. Produto apresentado pela farmácia como um tratamento específico para essa condição dermatológica. Utilizado por mais de 300 pacientes.',
      points: [
        'Formulação desenvolvida especificamente para auxiliar no controle da psoríase',
        'Produto utilizado e acompanhado por mais de 300 pacientes da farmácia',
        'Manipulação com rigor laboratorial e matérias-primas laudadas',
        'Acompanhamento técnico sob responsabilidade da Dra. Flávia Felix (CRF/PE 2654)'
      ],
      seals: ['+300 Pacientes', 'Padrão ANVISA', 'Garantia DermatoFlora'],
      whatsappMsg: 'Olá! Gostaria de solicitar um orçamento para o *Creme para Psoríase — 100 g* que vi no site da DermatoFlora. Poderiam me passar os detalhes?'
    },
    'venosan-6000': {
      id: 'venosan-6000',
      name: 'Venosan 6000 — Meia Coxa',
      category: 'Saúde Vascular / Meias de Compressão',
      presentation: 'Meia Coxa (AG) com Banda de Silicone',
      badge: 'Venosan Oficial',
      image: 'assets/images/prod-venosan-6000.svg',
      descTitle: 'Indicações de Saúde Vascular',
      description: 'Venosan 6000 — Meia Coxa, meia de compressão indicada para situações relacionadas à circulação dos membros inferiores, incluindo edema leve, veias varicosas leves, prevenção de varizes durante a gestação, insuficiência venosa crônica e cuidados após cirurgia venosa.',
      points: [
        'Indicada para edema leve e veias varicosas leves',
        'Prevenção de veias varicosas durante a gestação',
        'Insuficiência venosa crônica e período após cirurgia venosa',
        'Disponível na DermatoFlora com preços especiais e orientação para medidas'
      ],
      seals: ['Original Venosan®', 'Compressão Graduada', 'Vários Tamanhos'],
      whatsappMsg: 'Olá! Gostaria de consultar tamanhos e valores para a meia *Venosan 6000 — Meia Coxa* disponível na DermatoFlora.'
    },
    'florais-dermatoflora': {
      id: 'florais-dermatoflora',
      name: 'Florais DermatoFlora',
      category: 'Florais / Bem-Estar',
      presentation: 'Frasco Conta-gotas 30 ml (Gotas Sublinguais)',
      badge: 'Terapia Floral • Cromoterapia',
      image: 'assets/images/prod-florais-dermatoflora.svg',
      descTitle: 'Terapia Floral com Cromoterapia',
      description: 'Florais Dermatoflora desenvolvidos dentro da proposta de terapia floral, com linhas destinadas a adultos, crianças e animais de estimação. A empresa informa que trabalha com terapia floral potencializada por técnicas de cromoterapia e harmonização da água.',
      points: [
        'Floral Adulto: Linha de florais destinada ao público adulto',
        'Floral Kids: Linha de florais destinada ao público infantil',
        'Floral PET: Linha de florais destinada a animais de estimação',
        'Potencializada por técnicas de cromoterapia e harmonização da água'
      ],
      seals: ['Adulto • Kids • PET', 'Cromoterapia', 'Terapia Floral'],
      whatsappMsg: 'Olá! Gostaria de solicitar informações e orçamento para a linha de *Florais DermatoFlora* (Adulto, Kids ou PET).'
    },
    'green-select': {
      id: 'green-select',
      name: 'Green Select',
      category: 'Emagrecimento / Controle de Peso',
      presentation: 'Cápsulas de Extrato Fitoterápico',
      badge: '100% Natural',
      image: 'assets/images/prod-formula-emagrecedora.png',
      descTitle: 'Fórmula para Controle de Peso',
      description: 'Green Select, fórmula apresentada pela Dermatoflora como uma opção 100% natural para emagrecimento e controle de peso.',
      points: [
        'Fórmula apresentada pela farmácia como opção para emagrecimento e controle de peso',
        'Composição 100% natural conforme catálogo oficial DermatoFlora',
        'Matérias-primas com laudo de pureza e procedência garantida',
        'Atendimento com nossa equipe farmacêutica para tirar dúvidas'
      ],
      seals: ['100% Natural', 'Laudo de Pureza', 'Controle de Peso'],
      whatsappMsg: 'Olá! Gostaria de solicitar um orçamento para o *Green Select* que vi na vitrine da DermatoFlora.'
    },
    'linha-solar': {
      id: 'linha-solar',
      name: 'Linha de Proteção Solar',
      category: 'Proteção Solar / Vestuário',
      presentation: 'Bloqueadores, Camisas UV +50 e Bronzeadores',
      badge: 'Linha Solar Completa',
      image: 'assets/images/prod-linha-solar.svg',
      descTitle: 'Proteção Solar DermatoFlora',
      description: 'A Dermatoflora informa possuir uma linha de proteção solar composta por: Bloqueadores solares, Camisas UVA +50 FPS (disponíveis em todos os tamanhos) e Bronzeadores com FPS.',
      points: [
        'Bloqueadores solares disponíveis na linha de proteção solar da Dermatoflora',
        'Camisas com proteção UVA +50 FPS, disponíveis em diferentes tamanhos',
        'Bronzeadores com FPS para um tom dourado com a proteção necessária'
      ],
      seals: ['UVA +50 FPS', 'Todos os Tamanhos', 'Proteção Completa'],
      whatsappMsg: 'Olá! Gostaria de consultar os produtos da *Linha de Proteção Solar DermatoFlora* (Bloqueador, Camisa UV ou Bronzeador).'
    },
    'creme-clareador': {
      id: 'creme-clareador',
      name: 'Tratamento para Melasma e Manchas',
      category: 'Tratamento Dermatológico / Melasma',
      presentation: 'Creme Tópico Facial Manipulado',
      badge: 'Cuidado Facial',
      image: 'assets/images/prod-creme-clareador.png',
      descTitle: 'Tratamento Dermatológico',
      description: 'Tratamentos manipulados destinados aos cuidados dermatológicos relacionados ao melasma e manchas na pele, conforme orientação profissional.',
      points: [
        'Formulações manipuladas personalizadas de acordo com a prescrição médica',
        'Textura desenvolvida para absorção suave e conforto cutâneo',
        'Matérias-primas com laudo de qualidade farmacêutico'
      ],
      seals: ['Personalizado', 'Padrão ANVISA', 'Sob Orientação'],
      whatsappMsg: 'Olá! Gostaria de solicitar um orçamento para o *Tratamento para Melasma / Manchas* da DermatoFlora.'
    },
    'linha-pet': {
      id: 'linha-pet',
      name: 'Linha de Tratamento PET',
      category: 'Linha PET Veterinária',
      presentation: 'Biscoitos Palatáveis, Pastas Orais e Soluções',
      badge: 'Linha PET 🐾',
      image: 'assets/images/pet-mascote-dermatoflora.png',
      descTitle: 'Cuidados para Animais de Estimação',
      description: 'Linha de produtos e tratamentos manipulados destinada aos cuidados de animais de estimação. Dosagens personalizadas conforme prescrição do médico-veterinário.',
      points: [
        'Biscoitos mastigáveis e pastas orais palatáveis que facilitam a administração',
        'Doses rigorosamente calculadas para o peso e espécie do animal',
        'Adesão garantida ao tratamento veterinário com carinho e precisão'
      ],
      seals: ['Palatável', 'Dose por Peso', 'Linha Veterinária 🐾'],
      whatsappMsg: 'Olá! Gostaria de cotar uma fórmula veterinária manipulada para meu pet na *Linha PET DermatoFlora*.'
    }
  };

  /* ==========================================================================
     5. MODAL DE DETALHES DO PRODUTO (QUICK VIEW)
     ========================================================================== */
  const modalProduto = document.getElementById('modal-produto');
  const closeProductBtn = document.querySelector('.product-dialog-close');
  const modalProdBadge = document.getElementById('modal-prod-badge');
  const modalProdImg = document.getElementById('modal-prod-img');
  const modalProdTitle = document.getElementById('modal-prod-title');
  const modalProdPres = document.getElementById('modal-prod-presentation');
  const modalProdDescTitle = document.getElementById('modal-prod-desc-title');
  const modalProdDesc = document.getElementById('modal-prod-desc');
  const modalProdPoints = document.getElementById('modal-prod-points');
  const modalProdSeals = document.getElementById('modal-prod-seals');
  const modalProdWhatsappBtn = document.getElementById('modal-prod-whatsapp-btn');
  const modalProdPrescriptionBtn = document.getElementById('modal-prod-prescription-btn');

  function openProductDetail(productId) {
    const prod = OFFICIAL_PRODUCTS_DATA[productId];
    if (!prod || !modalProduto) return;

    if (modalProdBadge) modalProdBadge.textContent = prod.badge;
    if (modalProdImg) {
      modalProdImg.src = prod.image;
      modalProdImg.alt = prod.name;
    }
    if (modalProdTitle) modalProdTitle.textContent = prod.name;
    if (modalProdPres) modalProdPres.textContent = prod.presentation;
    if (modalProdDescTitle) modalProdDescTitle.textContent = prod.descTitle;
    if (modalProdDesc) modalProdDesc.textContent = prod.description;

    // Preenche lista de pontos
    if (modalProdPoints) {
      modalProdPoints.innerHTML = prod.points.map(pt => `
        <div class="product-dialog-point-item">
          <svg class="product-dialog-point-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>${pt}</span>
        </div>
      `).join('');
    }

    // Preenche selos
    if (modalProdSeals) {
      modalProdSeals.innerHTML = prod.seals.map(seal => `
        <span class="product-dialog-seal-item">✓ ${seal}</span>
      `).join('');
    }

    // Configura botão WhatsApp
    if (modalProdWhatsappBtn) {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prod.whatsappMsg)}`;
      modalProdWhatsappBtn.setAttribute('href', url);
    }

    // Abre o diálogo
    modalProduto.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeProductDetail() {
    if (modalProduto && modalProduto.open) {
      modalProduto.close();
      document.body.style.overflow = '';
    }
  }

  closeProductBtn?.addEventListener('click', closeProductDetail);
  modalProduto?.addEventListener('click', (e) => {
    if (e.target === modalProduto) closeProductDetail();
  });
  modalProduto?.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });

  // Botão "Enviar Receita com este Ativo" abre o modal de receita
  modalProdPrescriptionBtn?.addEventListener('click', () => {
    closeProductDetail();
    openPrescriptionModal();
  });

  // Clique em qualquer card de produto abre os detalhes
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Se clicou diretamente no botão de orçamento rápido, respeita o link se preferir ou abre o modal
      const prodId = card.getAttribute('data-product-id');
      if (prodId) {
        e.preventDefault();
        openProductDetail(prodId);
      }
    });

    // 3D Tilt suave no hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ==========================================================================
     6. FILTRO DE PRODUTOS POR CATEGORIA (VITRINE)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6.1 SELETOR DE FOCO RÁPIDO ("QUAL É O SEU FOCO HOJE?")
     ========================================================================== */
  const focusCards = document.querySelectorAll('.focus-card[data-focus-category]');
  focusCards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const handleFocusClick = () => {
      const targetCategory = card.getAttribute('data-focus-category');
      const matchingFilterBtn = document.querySelector(`.filter-btn[data-category="${targetCategory}"]`);
      
      if (matchingFilterBtn) {
        matchingFilterBtn.click();
      }

      // Smooth scroll até a vitrine de produtos compensando o header fixo
      const productsSection = document.getElementById('produtos');
      if (productsSection) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = productsSection.getBoundingClientRect().top + window.scrollY - headerHeight - 15;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };

    card.addEventListener('click', handleFocusClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFocusClick();
      }
    });
  });

  /* ==========================================================================
     7. MOCKUP DO INSTAGRAM INTERATIVO (CARROSSEL E BOTÃO DE LIKE)
     ========================================================================== */
  const igSlides = document.querySelectorAll('.ig-slide');
  const igPrevBtn = document.querySelector('.ig-nav-btn.prev');
  const igNextBtn = document.querySelector('.ig-nav-btn.next');
  const igLikeBtn = document.querySelector('.ig-action-icon.like-btn');
  const igHighlightCards = document.querySelectorAll('.ig-highlight-card');
  let currentIgSlide = 0;

  function showIgSlide(index) {
    igSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Sincroniza destaque ativo nos cards de categorias botânicas
    igHighlightCards.forEach((card) => {
      const targetSlide = parseInt(card.getAttribute('data-target-slide') || '-1', 10);
      card.classList.toggle('active', targetSlide === index);
    });
  }

  igNextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    currentIgSlide = (currentIgSlide + 1) % igSlides.length;
    showIgSlide(currentIgSlide);
  });

  igPrevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    currentIgSlide = (currentIgSlide - 1 + igSlides.length) % igSlides.length;
    showIgSlide(currentIgSlide);
  });

  igLikeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    igLikeBtn.classList.toggle('liked');
  });

  // Interatividade com os cards de destaques inferiores
  igHighlightCards.forEach((card) => {
    const handleCardActivate = () => {
      const target = parseInt(card.getAttribute('data-target-slide') || '0', 10);
      if (target >= 0 && target < igSlides.length) {
        currentIgSlide = target;
        showIgSlide(currentIgSlide);
      }
    };

    card.addEventListener('click', handleCardActivate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardActivate();
      }
    });
  });

  // Suporte retrocompatível para miniaturas em grade caso presentes
  const igGridThumbs = document.querySelectorAll('.ig-grid-thumb');
  igGridThumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      if (idx < igSlides.length) {
        currentIgSlide = idx;
        showIgSlide(currentIgSlide);
      }
    });
  });

  /* ==========================================================================
     7. CONTADORES NUMÉRICOS ANIMADOS (LABORATÓRIO & QUALIDADE)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target') || '0', 10);
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // ms
          const increment = target / (duration / 25);

          const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
              clearInterval(counter);
            } else {
              stat.textContent = `${prefix}${Math.floor(count).toLocaleString('pt-BR')}${suffix}`;
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     8. SCROLL REVEAL SUAVE (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     9. TOOLTIP DO WHATSAPP FLUTUANTE
     ========================================================================== */
  const whatsappTooltip = document.querySelector('.whatsapp-tooltip');
  if (whatsappTooltip) {
    setTimeout(() => {
      whatsappTooltip.style.opacity = '1';
    }, 1500);

    // Oculta tooltip após 12 segundos
    setTimeout(() => {
      whatsappTooltip.style.transition = 'opacity 0.5s ease';
      whatsappTooltip.style.opacity = '0';
    }, 12000);
  }

  /* ==========================================================================
     10. VÍDEO MOTION DA FARMACÊUTICA (AUTOPLAY RESILIENTE)
     ========================================================================== */
  const heroVideo = document.querySelector('.hero-motion-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      const playOnTouch = () => {
        heroVideo.play();
        window.removeEventListener('touchstart', playOnTouch);
        window.removeEventListener('scroll', playOnTouch);
      };
      window.addEventListener('touchstart', playOnTouch, { once: true, passive: true });
      window.addEventListener('scroll', playOnTouch, { once: true, passive: true });
    });
  }
});

