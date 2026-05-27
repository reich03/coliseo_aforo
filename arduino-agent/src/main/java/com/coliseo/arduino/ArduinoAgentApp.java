package com.coliseo.arduino;


public class ArduinoAgentApp {

    public static void main(String[] args) {

        String portName    = args.length > 0 ? args[0] : "COM3";
        int    baudRate    = args.length > 1 ? Integer.parseInt(args[1]) : 9600;
        String gatewayUrl  = args.length > 2 ? args[2] : "http://localhost:8085";

        System.out.println("=== Arduino Agent — Coliseo Aforo ===");
        System.out.println("Puerto : " + portName);
        System.out.println("Baud   : " + baudRate);
        System.out.println("Gateway: " + gatewayUrl);

        SerialReaderService.listarPuertos();

        MessageParser  parser  = new MessageParser();
        GatewayClient  client  = new GatewayClient(gatewayUrl);

        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            System.out.println("[Agent] Apagando Arduino Agent...")
        ));

        try (SerialReaderService serialReader = new SerialReaderService(portName, baudRate)) {

            System.out.println("[Agent] Puerto serial abierto. Escuchando...");

            
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
