from fastapi import APIRouter, HTTPException
from schemas.weather import DatosClimaticosMina
import requests
import os
from dotenv import load_dotenv
import json

router = APIRouter()

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

MINA_LAT = -20.9914
MINA_LON = -68.6386
MINA_CIUDAD = "Mina Collahuasi"

#Ruta donde irán los JSON
RUTA_JSON_SALIDA = os.path.join(os.path.dirname(__file__), "datos_clima.json")

@router.get("/api/alertas/actual", response_model=DatosClimaticosMina)
async def get_datos_fuente_para_ia():
    if not API_KEY:
        raise HTTPException(status_code=500, detail="OPENWEATHER_API_KEY no está configurada en .env")

    try:
        # --- Obtener Clima Actual ---
        url_clima = f"https://api.openweathermap.org/data/2.5/weather?lat={MINA_LAT}&lon={MINA_LON}&appid={API_KEY}&units=metric&lang=es"
        res_clima = requests.get(url_clima)
        res_clima.raise_for_status() # Lanza error si la API falla (ej. 401)
        data_clima = res_clima.json()

        # --- Obtener Polución del Aire ---
        url_polucion = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={MINA_LAT}&lon={MINA_LON}&appid={API_KEY}"
        res_polucion = requests.get(url_polucion)
        res_polucion.raise_for_status()
        data_polucion = res_polucion.json()

        # --- Extraer y Consolidar Datos ---
        main = data_clima.get('main', {})
        wind = data_clima.get('wind', {})
        clouds = data_clima.get('clouds', {})
        # Los datos de polución vienen en una lista, tomamos el primer item [0]
        componentes = data_polucion.get('list', [{}])[0].get('components', {})

        # --- Formatear el JSON de Salida ---
        datos_consolidados = DatosClimaticosMina(
            lugar=MINA_CIUDAD,
            temperatura_c=main.get('temp', 0),
            humedad_pct=main.get('humidity', 0),
            presion_hpa=main.get('pressure', 0),
            visibilidad_mts=data_clima.get('visibility', 10000), # Visibilidad
            nubes_pct=clouds.get('all', 0),                 # Nubosidad
            
            viento_velocidad_ms=wind.get('speed', 0),       # Viento
            viento_direccion_deg=wind.get('deg', 0),
            viento_rafaga_ms=wind.get('gust', 0),           # Ráfagas
            
            # .get('rain', {}) para evitar error si 'rain' no existe
            lluvia_1h_mm=data_clima.get('rain', {}).get('1h', 0),
            nieve_1h_mm=data_clima.get('snow', {}).get('1h', 0),
            
            # Polución
            polucion_pm10=componentes.get('pm10', 0),
            polucion_pm2_5=componentes.get('pm2_5', 0),
            polucion_co=componentes.get('co', 0),
            polucion_so2=componentes.get('so2', 0),
            polucion_no2=componentes.get('no2', 0),
            polucion_o3=componentes.get('o3', 0),
            polucion_nh3=componentes.get('nh3', 0)
        )
        
        try:
            # Convierte el objeto Pydantic a un diccionario
            datos_dict = datos_consolidados.model_dump() 
            with open(RUTA_JSON_SALIDA, "w", encoding="utf-8") as f:
                # Escribe el diccionario en el archivo JSON con formato legible
                json.dump(datos_dict, f, ensure_ascii=False, indent=2) 
            print(f"Datos guardados exitosamente en {RUTA_JSON_SALIDA}")
        except IOError as e:
            print(f"Error al guardar el archivo JSON: {e}")
            # Decide si quieres que esto sea un error crítico o solo una advertencia
            # raise HTTPException(status_code=500, detail=f"Error al guardar datos localmente: {e}")
        
        return datos_consolidados

    except requests.exceptions.RequestException as e:
        # Error si api de clima (OWM) no responde
        raise HTTPException(status_code=503, detail=f"Error al contactar API externa: {e}")
    except Exception as e:
        # Error si falla al procesar el JSON
        raise HTTPException(status_code=500, detail=f"Error interno al procesar los datos: {e}")