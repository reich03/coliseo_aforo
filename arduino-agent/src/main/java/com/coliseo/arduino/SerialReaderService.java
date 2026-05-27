package com.coliseo.arduino;

import com.fazecast.jSerialComm.SerialPort;

import java.io.BufferedReader;
import java.io.InputStreamReader;


public class SerialReaderService implements AutoCloseable {

    private final SerialPort port;
    private final BufferedReader reader;

    public SerialReaderService(String portName, int baudRate) {
        this.port = SerialPort.getCommPort(portName);
        this.port.setComPortParameters(baudRate, 8, 1, 0);
        this.port.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 0, 0);

        if (!this.port.openPort()) {
            throw new RuntimeException("No se pudo abrir el puerto serial: " + portName);
        }
        this.reader = new BufferedReader(new InputStreamReader(port.getInputStream()));
    }

  
    public String leerMensaje() {
        try {
            return reader.readLine();
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo el puerto serial", e);
        }
    }

    @Override
    public void close() {
        if (port.isOpen()) port.closePort();
    }

    
    public static void listarPuertos() {
        System.out.println("Puertos seriales disponibles:");
        for (SerialPort p : SerialPort.getCommPorts()) {
            System.out.println("  " + p.getSystemPortName() + " — " + p.getDescriptivePortName());
        }
    }
}
