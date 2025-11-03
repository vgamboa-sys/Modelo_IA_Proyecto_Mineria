<<<<<<< HEAD
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

import os 
import json 
import datetime
=======
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from database.db import get_db

import os 
import json 
>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed
from dotenv import load_dotenv
from google import genai # SDK de Google
from google.genai import types # Crear objeto de configuración
import time # Para la pausa de reintento
from google.api_core import exceptions as google_exceptions # Para capturar el error 503

<<<<<<< HEAD
router = APIRouter()

@router.get("/data_to_gemini_test",summary="Envía datos json del clima a Gemini y obtiene respuesta LLM")
def obtener_datos_gemini():
=======
###### Imports de DB
from sqlalchemy.orm import Session
from models import models

router = APIRouter()

@router.post("/data_to_gemini_test",summary="Envía datos json del clima a Gemini y obtiene respuesta LLM")
def obtener_datos_gemini(db: Session = Depends(get_db)):

>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed
    # Cargar credenciales API
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")

    if api_key is None:
        print("Error: La variable de entorno GEMINI_API_KEY no está configurada.")
    else:
        print("Si existe la API Gemini")

    # Pasar API a cliente
<<<<<<< HEAD
    cliente_ppj = genai.Client(api_key=api_key)
=======
    cliente_ppj = genai.Client(api_key=api_key)    
>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed

    try:
        # Cargar JSON
        with open("routers/datos_clima.json", "r", encoding="utf-8") as f:
            datos = json.load(f)
    except FileNotFoundError:
        print("No hay json encontrado")
        return JSONResponse(status_code=404, content={"error": "datos_clima.json no encontrado"})        
    except json.JSONDecodeError as e:
        print("JSON Inválido")
        return JSONResponse(status_code=500, content={"error": "JSON inválido", "detail": str(e)})
        
    

    # Generación Prompt

    # 1. MAPEO PROTOCOLOS (Acá la IA categoriza basado en esta plantilla)
    # -----------------------------------------------------------------

    Mapeo_Protocolo = {
        # --- RIESGOS COMBINADOS (Los más importantes) ---
        "alerta_hielo_escarcha": {
            "titulo": "Hielo en Caminos",
            "protocolo": "Suspender tránsito, aplicar sal/material abrasivo, evaluar uso de cadenas."
        },
        "alerta_ventisca": {
            "titulo": "Ventisca / Viento Blanco",
            "protocolo": "Detener todo tránsito de vehículos y personal, buscar refugio, activar plan de emergencia."
        },
        "alerta_polvo_viento": {
            "titulo": "Polvo por Viento Fuerte",
            "protocolo": "Reducir velocidad, usar luces, suspender tránsito si visibilidad es crítica. Humectar caminos."
        },

        # --- RIESGOS PRIMARIOS (Si no hay combinado) ---
        "alerta_temperatura_extrema": {
            "titulo": "Temperatura Extrema",
            "protocolo": "Reducir exposición, rotar turnos, asegurar hidratación/abrigo."
        },
        "alerta_visibilidad_niebla": {
            "titulo": "Niebla Densa",
            "protocolo": "Detener o restringir desplazamientos, usar señales adicionales, escolta."
        },
        "alerta_viento_fuerte": {
            "titulo": "Viento Fuerte",
            "protocolo": "Asegurar cargas, suspender operaciones de grúas/izaje."
        },
        "alerta_precipitacion_intensa": {
            "titulo": "Precipitación Intensa",
            "protocolo": "Controlar escorrentías, asegurar drenajes, evaluar riesgo aluvional."
        },
        "alerta_calidad_aire": {
            "titulo": "Calidad de Aire",
            "protocolo": "Proveer EPP respiratorio, limitar actividades, monitoreo continuo."
        },

        # --- REPORTE DE ESTATUS (Si no hay riesgos) ---
        "condiciones_normales": {
            "titulo": "Condiciones Normales",
            "protocolo": "Operaciones continúan con normalidad."
        }
    }

    # 2. CATEGORÍAS (Se generan desde el Mapeo)
    # -----------------------------------------------------------------
    
    Categorias_Riesgo = list(Mapeo_Protocolo.keys()) # Obtener categorías del mapeo    
    mapeo_json_string = json.dumps(Mapeo_Protocolo, indent=2, ensure_ascii=False) # Convertir mapeo a JSON para ingresarlo al prompt


    # 3. GENERACIÓN DE PROMPT (Generación de alertas específicas)
    # -----------------------------------------------------------------

    prompt = f"""Eres un analista experto en riesgos de seguridad para minería a rajo abierto.
    Tu trabajo es analizar los 'Datos de la mina' y devolver un **JSON que sea una LISTA (un array)**.
    La lista debe contener un objeto por CADA riesgo 'Alto' o 'Medio' que detectes.

    ---
    REGLAS DE DECISIÓN CRÍTICAS:
    1.  **Prioriza Combinaciones:** Si detectas un riesgo combinado (ej: 'alerta_hielo_escarcha' por Temp<0 y Lluvia>0), **NO** reportes los riesgos individuales ('alerta_temperatura_extrema' o 'alerta_precipitacion') que lo componen. El riesgo combinado los reemplaza.
    2.  **Riesgos Múltiples:** Si hay múltiples riesgos no relacionados (ej: 'alerta_viento_fuerte' y 'alerta_calidad_aire'), incluye ambos en la lista.
    3.  **SI NO HAY RIESGOS:** Si no encuentras NINGÚN riesgo 'Alto' o 'Medio', devuelve una lista con UN SOLO objeto: el de "condiciones_normales" y severidad "Baja".
    ---
    MAPEO DE PROTOCOLOS (Tu base de conocimiento. Úsala para 'titulo' y 'protocolo'):
    {mapeo_json_string}
    ---
    LISTA DE CATEGORÍAS VÁLIDAS (Elige de esta lista):
    {Categorias_Riesgo}
    ---
    DATOS DE LA MINA (Para analizar):
<<<<<<< HEAD
    Ciudad: {datos['ciudad']}
=======
    Lugar: {datos['lugar']}
>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed
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
    ---
    FORMATO DE SALIDA (Devuelve únicamente la lista JSON):

    -   **Si hay riesgos (Ejemplo):**
        `[ {{"categoria": "alerta_viento_fuerte", "severidad": "Alta", "titulo": "Viento Fuerte", "descripcion": "Riesgo por ráfagas de 25 m/s. Suspender operaciones de grúas."}}, {{"categoria": "alerta_calidad_aire", "severidad": "Media", "titulo": "Calidad de Aire", "descripcion": "Niveles PM2.5 en 40 ug/m3. Limitar actividades con polvo."}} ]`

    -   **Si NO hay riesgos (Ejemplo):**
        `[ {{"categoria": "condiciones_normales", "severidad": "Baja", "titulo": "Condiciones Normales", "descripcion": "Todos los parámetros están dentro de los rangos operativos seguros. Operaciones continúan con normalidad."}} ]`
    """
    # print (prompt) Para ver en consola si se cargó el prompt correctamente

    # 4. Implementar Genai (Google)
    # -----------------------------------------------------------------

    # Crear config genai
    config_personalizada = types.GenerateContentConfig(
        temperature=0.0,
        max_output_tokens=8192 # Potencia de 2, ojo con este parámetro que esta ligado a los tokens del prompt + pensamiento ia + respuesta ia (Se debe calcular limite tokens capa gratuita y modelo)
    )

    # Obtener respuesta de la API
    try:

        # CONFIGURACIÓN DE REINTENTOS 
        num_intentos = 3
        delay_entre_intentos_seg = 120 # 120 segundos = 2 minutos

        for attempt in range(num_intentos):
            try:
                print(f"Intento de llamada a Gemini {attempt + 1}/{num_intentos}...")

                respuesta = cliente_ppj.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=config_personalizada
                )

                print("Llamada exitosa.", flush=True)
                break

            except google_exceptions.ServiceUnavailable as e: # Captura Específica del 503
                print(f"Error 503 (Intento {attempt + 1}): Servidor sobrecargado.", flush=True)
                
                if attempt < num_intentos - 1: # Si no es el último intento
                    print(f"Reintentando en {delay_entre_intentos_seg} segundos...", flush=True)
                    time.sleep(delay_entre_intentos_seg)
                else:
                    # Es el último intento y también falló, relanzamos la excepción
                    print("Error: Todos los reintentos fallaron.", flush=True)
                    raise e # Esto será capturado por el 'except Exception as e' de abajo
        
        # Obtener texto de la respuesta
        texto_genai = respuesta.text      
        
        # print("Respueste repr ", (repr(respuesta))) Para debugear y conocer parametros de tokens usados en la llamada

        if not texto_genai:
            raise ValueError("El modelo devolvió una respuesta vacía o no válida.")
        
        # print (texto_genai)

        texto_limpio = texto_genai
        if texto_limpio.startswith("```json"):
            texto_limpio = texto_limpio[7:]  # Elimina ```json
        if texto_limpio.endswith("```"):
            texto_limpio = texto_limpio[:-3] # Elimina ```
        
        texto_limpio = texto_limpio.strip()

        try:
            lista_de_alertas = json.loads(texto_limpio)
        except json.JSONDecodeError:
            print("Error: Gemini no devolvió una lista JSON válida.")
            raise HTTPException(status_code=500, detail="Respuesta no válida de la IA.")
        
<<<<<<< HEAD
        for alerta in lista_de_alertas:
            categoria = alerta.get("categoria")
            # Busca la info (titulo y protocolo) en mapeo local
            info_protocolo = Mapeo_Protocolo.get(categoria, {})
            # Agrega el protocolo a la alerta (con un fallback por si acaso e.e)
            alerta["protocolo"] = info_protocolo.get("protocolo", "Protocolo no definido.")
        
        # Generar Datetime de la alerta
        fecha_generacion = datetime.datetime.now().isoformat()
        reporte_final_con_fecha = {
            "fecha_generacion": fecha_generacion,
            "alertas": lista_de_alertas  # Anidamos la lista original aquí
        }

        ruta_salida = "routers/alertas_generadas.json"
=======
        alertas_db = [] # Iniciar lista de alertas para guardar
        id_mina = 1 # Hardcodeado
        
        for alerta in lista_de_alertas:
            categoria = alerta.get("categoria")            
            info_protocolo = Mapeo_Protocolo.get(categoria, {}) # Busca la info (titulo y protocolo) en mapeo local
            # Agrega el protocolo a la alerta (con un fallback por si acaso e.e)
            alerta["protocolo"] = info_protocolo.get("protocolo", "Protocolo no definido.")
        
        # Generar objeto models.Alerta  

        try: 
            for alerta in lista_de_alertas:
                db_alerta = models.Alerta(
                    tipo_severidad=alerta.get("severidad"),
                    titulo=alerta.get("titulo"),
                    protocolo=alerta.get("protocolo"), 
                    descripcion=alerta.get("descripcion"),
                    id_mina=id_mina, # Id fijo
                    id_clima=None, # Id opcional
                    id_sismo=None # Id opcional                    
                )
                alertas_db.append(db_alerta)

            if alertas_db:                
                db.add_all(alertas_db)
                db.commit()
                print(f"¡ÉXITO! Se guardaron {len(alertas_db)} alertas en la base de datos (Mina ID: {id_mina}).")
        except Exception as e:
            db.rollback()
            print(f"Error al guardar Alertas en la DB: {e}")
            raise HTTPException(status_code=500, detail=f"Error al guardar en DB: {e}")

        '''
        # Código antiguo que guardaba JSON
        
        ruta_salida = "routers/alertas_generadas.json"

>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed
        try:
            with open(ruta_salida, "w", encoding="utf-8") as f:
                json.dump(reporte_final_con_fecha, f, ensure_ascii=False, indent=4)
            print(f"Respuesta guardada exitosamente en {ruta_salida}")
        except IOError as e:
            # Si falla al guardar, solo imprime el error pero no detengas la API
            print(f"ADVERTENCIA: No se pudo guardar el archivo JSON: {e}")

        return reporte_final_con_fecha
<<<<<<< HEAD
=======
        '''
    
        return JSONResponse(
            status_code=201, 
            content={
                "estado": "Éxito", 
                "mensaje": "Análisis completado y alertas guardadas en DB.",
                "num_alertas": len(alertas_db)
            }
        )
>>>>>>> 709d9eb75edc26dacf077f751f15b7e9f4e3a8ed
        
    except Exception as e:
        print("Error al llamar a Gemini:", e)
        raise HTTPException(status_code=500, detail=f"Error al procesar con Gemini: {e}")
    



