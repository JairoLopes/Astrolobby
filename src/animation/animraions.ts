// Animação: Texto inicia pequeno e sem opacidade, crescendo até o tamanho original e ganhando opacidade
const growIn = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Animação: Elemento desliza de cima para baixo enquanto ganha opacidade
const slideDownFadeIn = {
  initial: { y: "-100%", opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Animação: Elemento surgindo de baixo para cima com fade-in
const slideUpFadeIn = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" },
};

// Animação: Elemento gira em 360 graus enquanto ganha opacidade
const rotate360In = {
  initial: { rotate: -360, opacity: 0 },
  animate: {
    rotate: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

// Animação: Elemento aparece de forma pulsante, aumentando e diminuindo levemente de tamanho
const pulseIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.1, 1],
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Animação: Elemento desliza da esquerda para a posição original enquanto ganha opacidade
const slideRight = {
  initial: { x: "-100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideLeft = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export {
  slideRight,
  slideLeft,
  growIn,
  slideDownFadeIn,
  slideUpFadeIn,
  rotate360In,
  pulseIn,
};
