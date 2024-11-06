# Importiere Flask für die Webanwendung
from flask import Flask, request, jsonify

# Importiere die notwendigen Module für das Sprachmodell
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Importiere CORS, um Cross-Origin-Anfragen zu ermöglichen
from flask_cors import CORS

# Initialisiere die Flask-App
app = Flask(__name__)

# Aktiviere CORS für die Flask-App
CORS(app)  # Erlaubt Cross-Origin Requests (wichtig für lokale Entwicklung)

# Definiere das Prompt-Template
template = """
Answer the question below.

Here is the conversation history: {context}

Question: {question}

Answer:
"""

# Initialisiere das Sprachmodell mit dem gewünschten Modell
model = OllamaLLM(model="llama3.2")

# Erstelle ein ChatPromptTemplate aus dem Template
prompt = ChatPromptTemplate.from_template(template)

# Verbinde das Prompt mit dem Modell zu einer Kette
chain = prompt | model

# Erstelle ein Wörterbuch, um den Konversationskontext pro Sitzung zu speichern
session_contexts = {}

# Definiere die Route '/chat' für POST-Anfragen
@app.route('/chat', methods=['POST'])
def chat():
    # Hole die JSON-Daten aus der Anfrage
    data = request.get_json()
    
    # Extrahiere die Sitzung-ID und die Benutzer-Nachricht
    session_id = data.get('session_id')
    user_input = data.get('message')

    # Überprüfe, ob eine Sitzung-ID vorhanden ist
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400

    # Hole den aktuellen Kontext für die Sitzung oder initialisiere ihn leer
    context = session_contexts.get(session_id, "")

    # Rufe das Modell mit Kontext und Benutzerfrage auf
    result = chain.invoke({"context": context, "question": user_input})

    # Aktualisiere den Kontext mit der neuen Interaktion
    context += f"\nUser: {user_input}\nAI: {result}"
    session_contexts[session_id] = context

    # Gib die Antwort des Modells als JSON zurück
    return jsonify({'response': result})

# Starte die Flask-App, wenn das Skript direkt ausgeführt wird
if __name__ == '__main__':
    app.run(debug=True)  # Starte den Server im Debug-Modus
