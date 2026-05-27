package com.coliseo.arduino;


public class MessageParser {

    public LecturaRequestDto parse(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Mensaje vacío del Arduino");
        }

        String trimmed = raw.trim();

        if (trimmed.startsWith("IN:")) {
            int counter = Integer.parseInt(trimmed.substring(3));
            return new LecturaRequestDto("ENTRADA", counter);

        } else if (trimmed.startsWith("OUT:")) {
            int counter = Integer.parseInt(trimmed.substring(4));
            return new LecturaRequestDto("SALIDA", counter);

        } else {
            throw new IllegalArgumentException("Formato desconocido: " + raw);
        }
    }
}
