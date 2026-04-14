# Coliseo Aforo — Sistema de Control de Aforo en Tiempo Real
## Coliseo Álvaro Mesa Amaya · Villavicencio, Meta, Colombia

---

## Arquitectura

```
[HC-SR04 + Arduino Nano + LEDs]
        ↓ Serial USB 9600 baud
[Arduino Agent — Java process]
        ↓ HTTP POST /aforo/lecturas
[API Gateway :8080]
        ├─→ /aforo/**      → Aforo Microservice   :8081
        ├─→ /eventos/**    → Eventos Microservice  :8082
        ├─→ /reportes/**   → Reportes Microservice :8083
        └─→ /usuarios/**   → Usuarios Microservice :8084
                ↓ WebSocket STOMP push
[React Dashboard :5173]
```

## Requisitos

- Java 17
- Maven 3.9+
- Node.js 20+
- Docker + Docker Compose
- Arduino IDE

## Inicio rápido (Docker)

```bash
docker compose up --build
```

El frontend  en http://localhost:5173  
Swagger de cada MS:
- Aforo:    http://localhost:8081/swagger-ui.html
- Eventos:  http://localhost:8082/swagger-ui.html
- Reportes: http://localhost:8083/swagger-ui.html
- Usuarios: http://localhost:8084/swagger-ui.html

## Inicio sin Docker (desarrollo)

```bash
# Terminal 1 — Gateway
cd gateway && mvn spring-boot:run

# Terminal 2 — Aforo MS
cd aforo-ms && mvn spring-boot:run

# Terminal 3 — Eventos MS
cd eventos-ms && mvn spring-boot:run

# Terminal 4 — Reportes MS
cd reportes-ms && mvn spring-boot:run

# Terminal 5 — Usuarios MS
cd usuarios-ms && mvn spring-boot:run

# Terminal 6 — Frontend
cd aforo-dashboard && npm install && npm run dev

# Terminal 7 — Arduino Agent (conectar Arduino primero)
cd arduino-agent && mvn exec:java -Dexec.mainClass="com.coliseo.arduino.ArduinoAgentApp"
```

## Estructura de carpetas

```
coliseo-aforo/
├── gateway/
├── aforo-ms/
├── eventos-ms/
├── reportes-ms/
├── usuarios-ms/
├── arduino-agent/
├── aforo-dashboard/
├── arduino/
│   └── aforo_nano.ino
├── docker-compose.yml
└── README.md
```

## Integrantes

| Nombre | C�digo |
|---|---|
| Jhojan Andr�s Grisales Mora | 160004814 |
| Marlon Fabi�n Santofimio Romero | 160004837 |
| Jessica Marcela Baquero Mej�a | 160004303 |
| Juan David Carrillo Rizo | 160004805 |
| Oscar David Tibacuy Pab�n | 160004839 |
