# Archivo: main.py
import os
import requests
import uvicorn  # Para ejecutar el servidor
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

#c --- Configuración ---

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

MINA_LAT = -33.1431
MINA_LON = -70.2747
MINA_CIUDAD = "Mina Los Bronces"

# --- Modelo de Datos ---

class DatosClimaticosMina(BaseModel):
    ciudad: str
    temperatura_c: float
    humedad_pct: int
    visibilidad_mts: int
    nubes_pct: int
    viento_velocidad_ms: float
    viento_rafaga_ms: Optional[float] = 0.0
    lluvia_1h_mm: Optional[float] = 0.0
    nieve_1h_mm: Optional[float] = 0.0
    polucion_pm10: float
    polucion_pm2_5: float
    polucion_co: float
    polucion_so2: float
    polucion_no2: float
    polucion_o3: float
    polucion_nh3: float


app = FastAPI(
    title="SafeMine AI Data Clima",
    description="API que obtiene datos de clima y polución desde OWM."
)


@app.get("/api/alertas/actual", response_model=DatosClimaticosMina)
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
            ciudad=data_clima.get('name', MINA_CIUDAD),
            temperatura_c=main.get('temp', 0),
            humedad_pct=main.get('humidity', 0),
            visibilidad_mts=data_clima.get('visibility', 10000), # Visibilidad
            nubes_pct=clouds.get('all', 0),                 # Nubosidad
            
            viento_velocidad_ms=wind.get('speed', 0),       # Viento
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
        
        return datos_consolidados

    except requests.exceptions.RequestException as e:
        # Error si api de clima (OWM) no responde
        raise HTTPException(status_code=503, detail=f"Error al contactar API externa: {e}")
    except Exception as e:
        # Error si falla al procesar el JSON
        raise HTTPException(status_code=500, detail=f"Error interno al procesar los datos: {e}")

# --- Ejecutor ---
if __name__ == "__main__":
    print("--- Iniciando Servidor de Datos SafeMine (Solo Datos) ---")
    print(f"URL API: http://127.0.0.1:8000{app.routes[4].path}")
    print(f"Documentación:  http://127.0.0.1:8000/docs")
    print("----------------------------------------------------------")
    
    # Esto inicia el servidor
    uvicorn.run(app, host="127.0.0.1", port=8000)