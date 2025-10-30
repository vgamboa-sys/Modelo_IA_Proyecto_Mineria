# --- (Tu código existente: imports, router, etc.) ---
import json # Asegúrate de que json esté importado

# ...

@router.get("/data_to_gemini_test", summary="Envía datos json del clima a Gemini y obtiene respuesta LLM")
def obtener_datos_gemini():
    # ... (Tu código para cargar la API key y el archivo datos_clima.json) ...
    # try:
    #     with open("routers/datos_clima.json", "r", encoding="utf-8") as f:
    #         datos = json.load(f)
    # ... (manejo de errores) ...

    # 1. EL MAPEO DE PROTOCOLOS (Tu "Fuente de Verdad")
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
    # Esta es la lista de opciones que le das a la IA
    Categorias_Riesgo = list(Mapeo_Protocolo.keys())

    # Convertir el mapeo a un string JSON para inyectarlo en el prompt
    mapeo_json_string = json.dumps(Mapeo_Protocolo, indent=2, ensure_ascii=False)


    # 3. EL PROMPT MODIFICADO (Genera una Lista de Alertas)
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
---
FORMATO DE SALIDA (Devuelve únicamente la lista JSON):

-   **Si hay riesgos (Ejemplo):**
    `[ {{"categoria": "alerta_viento_fuerte", "severidad": "Alta", "titulo": "Viento Fuerte", "descripcion": "Riesgo por ráfagas de 25 m/s. Suspender operaciones de grúas."}}, {{"categoria": "alerta_calidad_aire", "severidad": "Media", "titulo": "Calidad de Aire", "descripcion": "Niveles PM2.5 en 40 ug/m3. Limitar actividades con polvo."}} ]`

-   **Si NO hay riesgos (Ejemplo):**
    `[ {{"categoria": "condiciones_normales", "severidad": "Baja", "titulo": "Condiciones Normales", "descripcion": "Todos los parámetros están dentro de los rangos operativos seguros. Operaciones continúan con normalidad."}} ]`
"""

    # ... (Tu código para la config_personalizada y cliente_ppj) ...
    # config_personalizada = types.GenerateContentConfig(...)
    
    # Obtener respuesta de la API
    try:
        respuesta = cliente_ppj.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=config_personalizada
        )
        
        texto_genai = respuesta.text
        
        if not texto_genai:
            raise ValueError("El modelo devolvió una respuesta vacía o no válida.")
        
        # ¡¡AQUÍ ESTÁ EL PASO CLAVE!!
        # Convertir el STRING de texto de Gemini en un objeto Python (una lista)
        try:
            lista_de_alertas = json.loads(texto_genai.strip())
        except json.JSONDecodeError:
            print("Error: Gemini no devolvió una lista JSON válida.")
            print("Respuesta cruda:", texto_genai)
            raise HTTPException(status_code=500, detail="Respuesta no válida de la IA.")
        
        # Devolver la LISTA directamente. 
        # FastAPI se encargará de convertirla a un JSON real para el frontend.
        return lista_de_alertas
        
    except Exception as e:
        print("Error al llamar a Gemini:", e)
        raise HTTPException(status_code=500, detail=f"Error al procesar con Gemini: {e}")