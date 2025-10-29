from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse

import os 
import json 
import datetime
import textwrap
from dotenv import load_dotenv
from google import genai # SDK de Google
from google.genai import types # Crear objeto de configuración

router = APIRouter()

@router.post("/data_to_gemini_test",summary="Envía datos a Gemini y obtiene respuesta LLM")
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

    # Generación Prompt
    Categorias = [
    "alerta_temperatura",
    "alerta_visibilidad",
    "alerta_viento",
    "alerta_precipitacion",
    "alerta_calidad_aire",
    "otro"
    ]

    Mapeo_Protocolo = {
    "alerta_temperatura": {
        "titulo": "temperatura",
        "protocolo": "Reducir exposición al calor/frío, rotar turnos y asegurar hidratación/abrigo. Activar comunicación de riesgo a supervisión y suspender tareas críticas si riesgo alto.",
        "fuente": "SERNAGEOMIN - Reglamento de Seguridad Minera / Guías de seguridad."
    },
    "alerta_visibilidad": {
        "titulo": "visibilidad",
        "protocolo": "Detener o restringir desplazamientos en superficie/zonas de alto tránsito; usar señales adicionales, iluminación y escolta para transporte; activar reportes de control.",
        "fuente": "SERNAGEOMIN - Guías de planes de contingencia."
    },
    "alerta_viento": {
        "titulo": "viento",
        "protocolo": "Asegurar cargas, suspender operaciones de grúas/elevación si rachas altas, proteger áreas de trabajo expuestas y refugiar personal en zonas seguras.",
        "fuente": "SERNAGEOMIN - Reglamento de Seguridad Minera."
    },
    "alerta_precipitacion": {
        "titulo": "precipitacion",
        "protocolo": "Reducir operaciones expuestas, controlar escorrentías, asegurar drenajes, suspender faenas críticas en caso de lluvia intensa o riesgo de aluviones.",
        "fuente": "SERNAGEOMIN - Guías de seguridad y planes de contingencia."
    },
    "alerta_calidad_aire": {
        "titulo": "calidad_aire",
        "protocolo": "Proveer EPP respiratorio, limitar actividades con polvo, activar monitoreo continuo y trasladar personal vulnerable; mantener comunicación con salud ocupacional.",
        "fuente": "SERNAGEOMIN / MINSAL - Protocolos de vigilancia."
    },
    "otro": {
        "titulo": "otro",
        "protocolo": "Evaluar situación específica, notificar a supervisión y Comités Paritarios; aplicar procedimientos de emergencia y medidas de protección según RIOHS y normativa.",
        "fuente": "D.S. N°132 / POLÍTICA NACIONAL DE SEGURIDAD Y SALUD EN LA MINERÍA."
    }    }

    prompt = f"""Eres un sistema que clasifica condiciones meteorológicas y entrega recomendaciones. Recibirás datos de una mina y debes devolver **UN SOLO JSON** (sin texto adicional) con estas claves:
    - categoria: una de {Categorias}
    - severidad: "Alta", "Media" o "Baja"
    - titulo: nombre simple (ej: "temperatura", "visibilidad", ...)
    - descripcion: 50 palabras máximo con medidas y aclaraciones (más clara la instrucción, mejor)
    Devuelve únicamente JSON válido.

    Datos de la mina:
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

    Reglas:
    - Si ninguna categoría aplica, usa "otro".
    - Severidad: Alta (riesgo inminente), Media (riesgo relevante), Baja (riesgo bajo).
    - Asegúrate de que el JSON sea parseable (ejemplo: {{"categoria":"alerta_viento","severidad":"Alta",...}}).
    """

    # print(f"polucion o3: {datos['polucion_o3']}") --Debug pasa datos del json al prompt OK
    

    #################### 
    ####################
    ####################
    ''''

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
        texto_genai = respuesta.candidates[0].content.parts[0].text      
        print("Respuesta text genai\n", texto_genai)

        if not texto_genai:
            raise ValueError("El modelo devolvió una respuesta vacía o no válida.")
        
        # Debug para ver si recibe respuesta
        print("Respuesta cruda del modelo:\n", texto_genai)

        
        # Praseo respuesta a JSON para alertas del frontend        
        try:
            parsed = json.loads(texto_genai)
        except Exception:
            # Si modelo devuelve ```json ... ``` u otros adornos, extraer bloque JSON
            import re
            m = re.search(r"\{.*\}", texto_genai, re.DOTALL)
            if m:
                parsed = json.loads(m.group(0))
            else:
                raise ValueError("No se pudo parsear la respuesta de Gemini como JSON: " + texto_genai[:300])

        # Validar campos mínimos
        categoria = parsed.get("categoria")
        severidad = parsed.get("severidad")
        titulo = parsed.get("titulo")
        descripcion = parsed.get("descripcion")

        if not categoria or categoria not in Categorias:
            categoria = "otro"

        if severidad not in ["Alta", "Media", "Baja"]:
            severidad = "Media"  # fallback

        if not titulo:
            titulo = Mapeo_Protocolo[categoria]["titulo"]

        # Fecha-hora ISO (UTC)
        fecha_hora = datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()

        # Protocolo de acción y fuente (según categoría)
        protocolo_entry = Mapeo_Protocolo.get(categoria, Mapeo_Protocolo["otro"])
        protocolo_accion = {
            "instruccion_corta": protocolo_entry["protocolo"],
            "fuente": protocolo_entry["fuente"],
            # Revisar con equipo si se agrega URL igual
        }

        salida = {
            "categoria": categoria,
            "severidad": severidad,
            "titulo": titulo,
            "fecha_hora": fecha_hora,
            "protocolo_accion": protocolo_accion,
            "descripcion": descripcion
        } 
        
        return PlainTextResponse(texto_genai, status_code=200)
        #return JSONResponse(status_code=200, content=salida) 
        
    except Exception as e:
        print("Error al llamar a Gemini:", e)
        raise HTTPException(status_code=500, detail=f"Error al procesar con Gemini: {e}")
    '''



