/*
 * aforo_nano.ino
 * Firmware para Arduino Nano — Sistema de Control de Aforo
 * Coliseo Álvaro Mesa Amaya, Villavicencio, Colombia
 *
 * HC-SR04 #1 (ENTRADA):  TRIG=D9,  ECHO=D10
 * HC-SR04 #2 (SALIDA  ):  TRIG=D11, ECHO=D12
 * LED Verde    → D4 → 220Ω → GND
 * LED Amarillo → D5 → 220Ω → GND
 * LED Rojo     → D6 → 220Ω → GND
 *
 * Protocolo serial (9600 baud):
 *   Envía:   "IN:<contador>"  o  "OUT:<contador>"
 *   Recibe:  "SET:<valor>"   → sincroniza el contador con el backend
 */

// ─── Pines ────────────────────────────────────────────────
#define TRIG_A  2   // sensor ENTRADA
#define ECHO_A  4   // sensor ENTRADA
#define TRIG_B  7   // sensor SALIDA
#define ECHO_B  9   // sensor SALIDA

// LEDs no conectados en esta versión
// #define LED_VERDE    4
// #define LED_AMARILLO 5
// #define LED_ROJO     6

// ─── Configuración ────────────────────────────────────────
const int UMBRAL_CM       = 30;  // Distancia máxima para detectar persona (cm)
const int DEBOUNCE_MS     = 500; // Tiempo mínimo entre detecciones consecutivas

// ─── Estado global ────────────────────────────────────────
int contadorLocal = 0;       // Espejo local del conteo (sincronizado con backend)
unsigned long ultimaDeteccion = 0;

// ─── Utilidades ───────────────────────────────────────────

/**
 * Mide la distancia en centímetros con un sensor HC-SR04.
 */
float medirDistancia(int pinTrig, int pinEcho) {
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);

  long duracion = pulseIn(pinEcho, HIGH, 30000); // timeout 30 ms
  if (duracion == 0) return 999; // sin lectura → lejos
  return duracion * 0.034 / 2.0;
}

/**
 * Actualiza los LEDs del semáforo según el porcentaje de aforo.
 * El backend envía "SET:<valor>" con el nuevo conteo.
 */
void actualizarSemaforo(int personas, int aforoMax) {
  // LEDs no conectados — solo imprime estado por Serial
  if (aforoMax <= 0) return;
  float pct = (float)personas / aforoMax * 100.0f;
  if (pct >= 100.0f)      Serial.println("[LED] ROJO  — LLENO");
  else if (pct >= 70.0f)  Serial.println("[LED] AMARILLO — ALERTA");
  else                    Serial.println("[LED] VERDE — LIBRE");
}

/**
 * Lee comandos entrantes del Arduino Agent por Serial.
 * Formato esperado: "SET:45\n"
 */
void leerComandoSerial() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("SET:")) {
      int nuevoValor = cmd.substring(4).toInt();
      contadorLocal = nuevoValor;
      // Actualiza el semáforo (usado aforo máximo por defecto = 1000)
      actualizarSemaforo(contadorLocal, 1000);
    }
  }
}

// ─── Setup / Loop ─────────────────────────────────────────

void setup() {
  Serial.begin(9600);

  // Sensores
  pinMode(TRIG_A, OUTPUT);
  pinMode(ECHO_A, INPUT);
  pinMode(TRIG_B, OUTPUT);
  pinMode(ECHO_B, INPUT);

  // LEDs no conectados en esta versión

  Serial.println("READY");
}

void loop() {
  // Leer posibles comandos del backend
  leerComandoSerial();

  unsigned long ahora = millis();
  if (ahora - ultimaDeteccion < (unsigned long)DEBOUNCE_MS) return;

  float distA = medirDistancia(TRIG_A, ECHO_A);
  float distB = medirDistancia(TRIG_B, ECHO_B);

  bool activoA = distA < UMBRAL_CM;
  bool activoB = distB < UMBRAL_CM;

  // Lógica de dirección:
  // INGRESO: sensor A se activa antes que B → persona entra
  // SALIDA:  sensor B se activa antes que A → persona sale
  //
  // Implementación simplificada:
  // Si solo A está activo → ENTRADA (confirmamos en el siguiente ciclo)
  // Si solo B está activo → SALIDA

  if (activoA && !activoB) {
    // Esperamos a confirmar que B también se activa (persona cruzando)
    delay(150);
    float distB2 = medirDistancia(TRIG_B, ECHO_B);
    if (distB2 < UMBRAL_CM) {
      // A se activó primero → ENTRADA
      contadorLocal++;
      Serial.print("IN:");
      Serial.println(contadorLocal);
      ultimaDeteccion = millis();
    }
  } else if (activoB && !activoA) {
    // Confirmamos que A también se activa
    delay(150);
    float distA2 = medirDistancia(TRIG_A, ECHO_A);
    if (distA2 < UMBRAL_CM) {
      // B se activó primero → SALIDA
      if (contadorLocal > 0) contadorLocal--;
      Serial.print("OUT:");
      Serial.println(contadorLocal);
      ultimaDeteccion = millis();
    }
  }
}

