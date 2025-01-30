<script lang="ts" setup>
import {onMounted} from "vue";
// import {loadFull} from "tsparticles"; // Importa la librería

onMounted(() => {
  loadFull().then((particles) => {
    particles.load("particles-container", {
      particles: {
        number: {
          value: 100, // Número de partículas (formas geométricas)
          density: {
            enable: true,
            value_area: 800, // Controla la densidad de las partículas
          },
        },
        shape: {
          type: "circle", // Las formas serán círculos
        },
        color: {
          value: "#808080", // Color gris
        },
        size: {
          value: 4, // Tamaño de las partículas
        },
        move: {
          enable: true, // Hacer que las partículas se muevan
          speed: 1, // Velocidad de movimiento de las partículas
          direction: "none", // Dirección aleatoria
          random: true, // Movimiento aleatorio
          straight: false,
        },
        opacity: {
          value: 0.5, // Opacidad de las partículas
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1, // La opacidad mínima será más baja para un efecto más dinámico
          },
        },
      },
    });
  });
});
</script>

<template>
  <div id="particles-container" class="particles-container"></div>
</template>

<style scoped>
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Para que no interfiera con los eventos de clic en el contenido */
  z-index: -1; /* Para que esté detrás del contenido */
}
</style>