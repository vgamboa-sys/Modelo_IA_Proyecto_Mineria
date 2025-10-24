import os
from dotenv import load_dotenv
import json
from google import genai # SDK de Google
from google.genai import types # Crear objeto de configuración


# Cargar credenciales API
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key is None:
    print("Error: La variable de entorno GEMINI_API_KEY no está configurada.")
else:
    print("Si existe la API Gemini")

# Pasar API a cliente
cliente_ppj = genai.Client(api_key=api_key)

# Cargar JSON
with open("datos_clima.json", "r", encoding="utf-8") as f:
    datos = json.load(f)

# Generación Prompt
categorias_ejemplo =  [
"alerta_temperatura", 
"alerta_visibilidad", 
"alerta_viento", 
"alerta_precipitacion", 
"alerta_calidad_aire",
"otro"]

# prompt = "Dame el pokemon mas fuerte con su descripción. Max. 30 palabras"
# prompt = f"En base a estos datos del json {json.dumps(datos, ensure_ascii=False, separators=(",", ":"))}, dime algunas recomendaciones de seguridad. Max 50 palabras"
prompt = """Eres un sistema de monitoreo minero. A partir de los siguientes datos de la mina "Mina Los Bronces", dame recomendaciones de seguridad breves (máx. 50 palabras). Devuelve solo texto:

Ciudad: Mina Los Bronces
Temperatura (°C): -5.12
Humedad (%): 59
Visibilidad (mts): 6967
Nubes (%): 100
Viento velocidad (m/s): 4.08
Viento ráfaga (m/s): 7.02
Lluvia 1h (mm): 0
Nieve 1h (mm): 0.13
Polución PM10: 12.27
Polución PM2.5: 9.32
CO: 155.28
SO2: 1
NO2: 2.56
O3: 54.16
NH3: 3.51
"""


# Crear config genai
config_personalizada = types.GenerateContentConfig(
    temperature=0.0,
    max_output_tokens=800
)

# Obtener respuesta de la API
try:
    respuesta = cliente_ppj.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config_personalizada
    )
    
    # Obtener texto de la respuesta
    texto_genai = respuesta.text

    if not texto_genai:
        raise ValueError("El modelo devolvió una respuesta vacía o no válida.")
    
    print("Respuesta cruda del modelo:\n", texto_genai)
    
    # print("Respuesta JSON:", json.dumps(resultado, indent=2, ensure_ascii=False))
    
except Exception as e:
    print("Error al llamar a Gemini:", e)



