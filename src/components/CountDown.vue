<template>
  <!-- Contenedor con estilo inline para posicionar y animar mediante transform -->
  <div :style="containerStyle">
    <Card class="p-4 shadow-lg">
      <div>
        <p class="text-center text-sm text-gray-500 mt-2">Faltan...</p>
      </div>
      <div class="text-center font-light" style="font-size: 39px;">
        {{ countdownText }}
      </div>
      <div>
        <p class="text-center text-sm text-gray-500 mt-2">
          Para el inicio de Registro de Candidaturas
        </p>
      </div>
      <div class="mt-2 flex justify-center">
        <Button variant="outline" @click="togglePosition">
          {{ position === 'right' ? 'Mover a la izquierda' : 'Mover a la derecha' }}
        </Button>
      </div>
    </Card>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';

// Define la fecha esperada (puede venir de prop, store, etc.)
const expectedDate = new Date('2025-03-22T00:00:00');

// Variable para la posición: 'right' (inicial) o 'left'
const position = ref('right');

const cardWidth = 300; // ancho del Card en px
const margin = 64;     // margen en px (1rem, aproximadamente)

// Computed para generar un estilo inline que posicione el contenedor y aplique la transformación
const containerStyle = computed(() => {
  // Siempre ubicamos el contenedor en la esquina inferior izquierda
  // Y aplicamos un translateX para moverlo a la derecha cuando corresponda.
  return {
    position: 'fixed',
    bottom: `${margin}px`,
    left: `${margin}px`,
    // Si la posición es "right", movemos el contenedor al lado derecho.
    // Calculamos: ancho total de la ventana menos (ancho de la tarjeta + 2 * margen)
    transform:
        position.value === 'right'
            ? `translateX(calc(100vw - ${cardWidth + margin * 2}px))`
            : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out'
  };
});

// Variable reactiva para el tiempo restante (en milisegundos)
const remainingTime = ref(expectedDate - new Date());

// Prop. computada para formatear el tiempo restante en días, horas, minutos y segundos (los odio)
const countdownText = computed(() => {
  const diff = remainingTime.value;
  if (diff <= 0) return "Tiempo terminado";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
});

// Actualizamos el contador cada segundo
let intervalId = null;
onMounted(() => {
  intervalId = setInterval(() => {
    remainingTime.value = expectedDate - new Date();
  }, 1000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});

// Función para alternar la posición
function togglePosition() {
  position.value = position.value === 'right' ? 'left' : 'right';
}
</script>

<style scoped>
/* Puedes ajustar estilos adicionales aquí si es necesario */
</style>
