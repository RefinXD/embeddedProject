#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#define API_KEY "AIzaSyD40lZHQyy7IO1-tAHTp7Xpc5dknj4RpC4"
#define DATABASE_URL "https://embed-lab-5ca54-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define LED D4
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
SoftwareSerial NodeSerial(D2, D3); // RX | TX
SoftwareSerial NodeSerial2(D5, D6); // RX | TX
#define OUT_LED D7
bool signupOK = false;

const char* ssid = "Boom iPhone"; //true_home2G_f4G Boom iPhone TP-Link_5E7B
const char* password = "Boom2544"; //fTUFMfXm Boom2544 51056263
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "0e472421-b532-42fe-9559-32a3e1676e6e";
const char* mqtt_username = "7sWxDWRv9vFm5GRWpBZFcgaosXu6RJwq";
const char* mqtt_password = "yZVIZwJKRCgln6LSKg0QAGanea6wCU!F";

char msg[100];

WiFiClient espClient;
PubSubClient client(espClient);

long lastUpdate = 0;
int value = 0;



void setup() {

  Serial.begin(9600);
  pinMode(D2, INPUT);
  pinMode(D3, OUTPUT);
  NodeSerial.begin(9600);
  pinMode(D5, INPUT);
  pinMode(D6, OUTPUT);
  NodeSerial2.begin(9600);
  pinMode(LED, OUTPUT); // setup output
  pinMode(D7, OUTPUT);
  //NodeSerial3.begin(9600);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  }
  else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }
  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  digitalWrite(LED, HIGH);
}

void loop() {

  long now = millis();

  if (Firebase.ready() && signupOK) {



    if (NodeSerial.available() > 0) {

      lastUpdate = now;
      int c = NodeSerial.read();
      if (Firebase.RTDB.setInt(&fbdo, "sensor1/int", c)) {
        Serial.println("PASSED");
        Serial.println(c);
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
        //digitalWrite(LED,LOW);
      }
      else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
      }
      NodeSerial.write(1);
    }

    if (NodeSerial2.available() > 0 && Firebase.RTDB.getBool(&fbdo, "/isOpen/bool")) {
      if (!fbdo.boolData()) {

        int d = NodeSerial2.read() - 48;
        if (Firebase.RTDB.setInt(&fbdo, "sensor2/int", d)) {
          Serial.println("PASSED");
          Serial.println(d);
          Serial.println("PATH: " + fbdo.dataPath());
          Serial.println("TYPE: " + fbdo.dataType());
        }
        else {
          //Serial.println("FAILED");
          //Serial.println("REASON: " + fbdo.errorReason());
        }
        NodeSerial.write(1);
      }
    }

    if (Firebase.RTDB.getBool(&fbdo, "/isOpen/bool")) {
      if (fbdo.boolData()) {
        digitalWrite(OUT_LED, HIGH);
        
      }
      else {
        digitalWrite(OUT_LED, LOW);
      }
    }

    if (Firebase.RTDB.getInt(&fbdo, "/sensor1/int")) {
      if (fbdo.intData() == 1 && now - lastUpdate > 4000) {
        if (Firebase.RTDB.setInt(&fbdo, "sensor1/int", 0)) {
          Serial.println("PASSED");
          Serial.println(0);
          Serial.println("PATH: " + fbdo.dataPath());
          Serial.println("TYPE: " + fbdo.dataType());
          //digitalWrite(LED,HIGH);
        }
        else {
          Serial.println("FAILED");
          Serial.println("REASON: " + fbdo.errorReason());
        }

      }
    }

  }

}
