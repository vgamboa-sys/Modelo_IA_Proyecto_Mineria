from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

import os
from dotenv import load_dotenv
import json
from google import genai # SDK de Google
from google.genai import types # Crear objeto de configuración

router = APIRouter()

@router.get("/data_to_gemini",summary="Envía datos a Gemini y obtiene respuesta LLM")
def obtener_datos_gemini():
    # Cargar credenciales API
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")

    if api_key is None:
        print("Error: La variable de entorno GEMINI_API_KEY no está configurada.")
    else:
        print("Si existe la API Gemini")

    # Pasar API a cliente
    cliente_ppj = genai.Client(api_key=api_key)

    try:
        # Cargar JSON
        with open("routers/datos_clima.json", "r", encoding="utf-8") as f:
            datos = json.load(f)
    except FileNotFoundError:
        return JSONResponse(status_code=404, content={"error": "datos_clima.json no encontrado"})
    except json.JSONDecodeError as e:
        return JSONResponse(status_code=500, content={"error": "JSON inválido", "detail": str(e)})

    # Generación Prompt (Idea cuando se definan datos)
    '''categorias_ejemplo = [
    "alerta_temperatura", 
    "alerta_visibilidad", 
    "alerta_viento", 
    "alerta_precipitacion", 
    "alerta_calidad_aire",
    "otro"]'''

    prompt = f"""Eres un sistema de monitoreo minero. A partir de los siguientes datos de la mina "{datos['ciudad']}", dame recomendaciones de seguridad breves (máx. 50 palabras). Devuelve solo texto:

    Ciudad: {datos['ciudad']}
    Temperatura (°C): {datos['temperatura_c']}
    Humedad (%): {datos['humedad_pct']}
    Visibilidad (mts): {datos['visibilidad_mts']}
    Nubes (%): {datos['nubes_pct']}
    Viento velocidad (m/s): {datos['viento_velocidad_ms']}
    Viento ráfaga (m/s): {datos['viento_rafaga_ms']}
    Lluvia 1h (mm): {datos['lluvia_1h_mm']}
    Nieve 1h (mm): {datos['nieve_1h_mm']}
    Polución PM10: {datos['polucion_pm10']}
    Polución PM2.5: {datos['polucion_pm2_5']}
    CO: {datos['polucion_co']}
    SO2: {datos['polucion_so2']}
    NO2: {datos['polucion_no2']}
    O3: {datos['polucion_o3']}
    NH3: {datos['polucion_nh3']}
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

        return {"alerta_generada": texto_genai}    
        
    except Exception as e:
        print("Error al llamar a Gemini:", e)
        raise HTTPException(status_code=500, detail=f"Error al procesar con Gemini: {e}")



