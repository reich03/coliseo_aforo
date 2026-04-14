package com.coliseo.arduino;

/**
 * Punto de entrada del Arduino Agent.
 *
 * USO:
 *   java -jar arduino-agent.jar COM3 9600 http://localhost:8080
 *
 * Argumentos:
 *   args[0] = Puerto serial (ej. COM3 en Windows, /dev/ttyUSB0 en Linux)
 *   args[1] = Baud rate (normalmente 9600)
 *   args[2] = URL base del API Gateway
 */
public class ArduinoAgentApp {

    public static void main(String[] args) {

        // Configuración por defecto para desarrollo
        String portName    = args.length > 0 ? args[0] : "COM3";
        int    baudRate    = args.length > 1 ? Integer.parseInt(args[1]) : 9600;
        String gatewayUrl  = args.length > 2 ? args[2] : "http://localhost:8080";

        System.out.println("=== Arduino Agent — Coliseo Aforo ===");
        System.out.println("Puerto : " + portName);
        System.out.println("Baud   : " + baudRate);
        System.out.println("Gateway: " + gatewayUrl);

        // Listar puertos disponibles para facilitar la configuración
        SerialReaderService.listarPuertos();

        MessageParser  parser  = new MessageParser();
        GatewayClient  client  = new GatewayClient(gatewayUrl);

        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            System.out.println("[Agent] Apagando Arduino Agent...")
        ));

        try (SerialReaderService serialReader = new SerialReaderService(portName, baudRate)) {

            System.out.println("[Agent] Puerto serial abierto. Escuchando...");

            // GRASP Pure Fabrication: el bucle principal encapsula
            // la lógica de integración hardware—software
            while (true) {
                String raw = serialReader.leerMensaje();

                if (raw == null || raw.isBlank()) continue;

                System.out.println("[Serial] Recibido: " + raw);

                try {
                    LecturaRequestDto dto = parser.parse(raw);
                    client.post("/aforo/lecturas", dto);
                } catch (IllegalArgumentException e) {
                    System.err.println("[Agent] Mensaje ignorado: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            System.err.println("[Agent] Error fatal: " + e.getMessage());
            System.exit(1);
        }
    }
}
