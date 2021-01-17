Adafruit_NeoPixel pixels(NUMPIXELS, LED_PIN, NEO_RGB + NEO_KHZ800);

void setPixels(uint32_t color) {

  // Unused pixel for signal propagation in long wire :)
//  pixels.setPixelColor(0, 0);
  pixels.setPixelColor(0, color);

  for (byte i = 0; i < NUMPIXELS; i++) {
    if (
      (circle == 0 && i > 0) ||
      (circle > 0 && i == 0) ||
      (circle == 1 && i > 3)
    ) {
      pixels.setPixelColor(i + 1, 0);
    } else {
      pixels.setPixelColor(i + 1, color);
    }
  }
  pixels.show();
}

void neopixels_setup() {
  pixels.begin();
  setPixels(0);
}
