const particlesConfig = {
  particles: {
    number: {
      value: 55,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#f1c40f", "#3498db", "#ffffff"]
    },
    shape: {
      type: ["circle", "image"],
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon : {
        nb_sides: 5
      },
      image: [
        {
          src: "https://static.thenounproject.com/png/1357377-200.png",
          height: 20,
          width: 20,
        },
        {
          src: "https://static.thenounproject.com/png/3767871-200.png",
          height: 10,
          width: 10,
        },
        {
          src: "https://static.thenounproject.com/png/108491-200.png",
          height: 20,
          width: 20,
        },
      ],
    },
    opacity: {
      value: 1,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 1,
        sync: false,
      },
    },
    size: {
      value: 30,
      random: false,
      anim: {
        enable: true,
        speed: 4,
        size_min: 20,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 10,
      direction: "bottom-left",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 600,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 1,
        opacity: 1,
        speed: 100,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

export default particlesConfig;
