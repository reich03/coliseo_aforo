
#define TRIG_A  2   // sensor ENTRADA
#define ECHO_A  4   // sensor ENTRADA
#define TRIG_B  7   // sensor SALIDA
#define ECHO_B  9   // sensor SALIDA

// #define LED_VERDE    4
// #define LED_AMARILLO 5
// #define LED_ROJO     6

const int UMBRAL_CM       = 30;  
const int DEBOUNCE_MS     = 500; 

int contadorLocal = 0;       
unsigned long ultimaDeteccion = 0;


float medirDistancia(int pinTrig, int pinEcho) {
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);

  long duracion = pulseIn(pinEcho, HIGH, 30000);
  if (duracion == 0) return 999; 
  return duracion * 0.034 / 2.0;
}


void actualizarSemaforo(int personas, int aforoMax) {
  if (aforoMax <= 0) return;
  float pct = (float)personas / aforoMax * 100.0f;
  if (pct >= 100.0f)      Serial.println("[LED] ROJO  — LLENO");
  else if (pct >= 70.0f)  Serial.println("[LED] AMARILLO — ALERTA");
  else                    Serial.println("[LED] VERDE — LIBRE");
}


void leerComandoSerial() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("SET:")) {
      int nuevoValor = cmd.substring(4).toInt();
      contadorLocal = nuevoValor;
      actualizarSemaforo(contadorLocal, 1000);
    }
  }
}


void setup() {
  Serial.begin(9600);

  pinMode(TRIG_A, OUTPUT);
  pinMode(ECHO_A, INPUT);
  pinMode(TRIG_B, OUTPUT);
  pinMode(ECHO_B, INPUT);


  Serial.println("READY");
}

void loop() {
  leerComandoSerial();

  unsigned long ahora = millis();
  if (ahora - ultimaDeteccion < (unsigned long)DEBOUNCE_MS) return;

  float distA = medirDistancia(TRIG_A, ECHO_A);
  float distB = medirDistancia(TRIG_B, ECHO_B);

  bool activoA = distA < UMBRAL_CM;
  bool activoB = distB < UMBRAL_CM;



  if (activoA && !activoB) {
    delay(150);
    float distB2 = medirDistancia(TRIG_B, ECHO_B);
    if (distB2 < UMBRAL_CM) {
      contadorLocal++;
      Serial.print("IN:");
      Serial.println(contadorLocal);
      ultimaDeteccion = millis();
    }
  } else if (activoB && !activoA) {
    delay(150);
    float distA2 = medirDistancia(TRIG_A, ECHO_A);
    if (distA2 < UMBRAL_CM) {
      if (contadorLocal > 0) contadorLocal--;
      Serial.print("OUT:");
      Serial.println(contadorLocal);
      ultimaDeteccion = millis();
    }
  }
}
