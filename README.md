# EscapeToSat 💸

¡Un juego arcade de alta velocidad donde tu único objetivo es sobrevivir! Esquiva al SAT y sus minions, junta puntos y demuestra cuánto tiempo puedes aguantar sin pagar impuestos... digo, ¡sin que te atrapen!

## 🎮 ¡JUEGA AHORA! 🎮

Puedes jugar la versión más reciente directamente en tu navegador:

**[https://arthurhack4u.github.io/EscapeToSat/](https://arthurhack4u.github.io/EscapeToSat/)**

---

## 🕹️ Cómo Jugar

Los controles son simples, pero el juego es brutal.

* **Moverse:** Usa las **Flechas del Teclado** (`← ↑ → ↓`) para moverte por el área.
* **Dash (Impulso):** Presiona la **Barra Espaciadora** para un rápido impulso que te hace invencible por un instante. ¡Úsalo sabiamente, tiene enfriamiento!
* **Objetivo:** Atrapa los orbes dorados (🪙) para sumar puntos y subir de nivel.
* **Peligro:** ¡No dejes que el SAT (👹) o sus secuaces te toquen!

---

## ✨ Características

Este no es un simple juego de "esquivar". Le metimos nitro con varias características:

* **Niveles Progresivos:** Cada 5 puntos subes de nivel, la velocidad aumenta y aparece un nuevo "minion" del SAT para hacerte la vida imposible.
* **Sistema de Dash:** Un movimiento evasivo con *cooldown* para esos momentos en los que estás acorralado.
* **Tabla de High Scores:** El juego guarda tus 5 mejores puntuaciones (puntos y tiempo) usando el `localStorage` de tu navegador. ¡Compite contra ti mismo!
* **Efectos Especiales:**
    * **Screen Shake:** La pantalla tiembla cuando te atrapan.
    * **Partículas:** Estelas de jugador, explosión de orbes y efectos de "Level Up".
    * **Animaciones:** Cuenta atrás de inicio, animaciones "pop" y más.
* **Música de Fondo y Configuración:** Música adictiva para mantener la adrenalina y un menú de configuración para ajustar la dificultad y el fondo del juego.

---

## 💻 Tecnologías Usadas

Este proyecto es 100% "Vanilla" (sin frameworks), construido con las bases de la web:

* **HTML5:** Para la estructura del juego.
* **CSS3:** Para todos los estilos, animaciones (`@keyframes`), efectos de partículas y diseño responsivo de los menús.
* **JavaScript (ES6+):** Para toda la lógica del juego, incluyendo:
    * El "Game Loop" (`requestAnimationFrame`).
    * Detección de colisiones.
    * Manejo de estado del juego (menús, pausa, juego).
    * Manipulación del DOM para efectos y UI.
    * API de `Audio` para la música.
* **"Backend" Falso:** Uso de `localStorage` para simular una base de datos y guardar las puntuaciones más altas.

---

## 🚀 Instalación Local

Si quieres correr el proyecto en tu propia máquina:

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/arthurhack4u/EscapeToSat.git](https://github.com/arthurhack4u/EscapeToSat.git)
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd EscapeToSat
    ```
3.  Abre el archivo `index.html` en tu navegador.
    *(Se recomienda usar una extensión como "Live Server" en VS Code para evitar problemas con la carga del audio).*
