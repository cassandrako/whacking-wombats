#include <Arduino.h>

const int buttonPins[] = {2, 3, 4, 5, 6, 7};
const int numButtons = 6;

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < numButtons; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP); 
  }
}

void loop() {
    for (int i = 0; i < numButtons; i++) {
        if (digitalRead(buttonPins[i]) == LOW) {
            Serial.print("Button pressed on pin: ");
            Serial.println(buttonPins[i]);  // Log which button was pressed
            delay(200); 
        }
    }
}
