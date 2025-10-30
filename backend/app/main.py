import uvicorn  # Para ejecutar el servidor
from fastapi import FastAPI
from routers import data_weather, cnx_IA, data_sismos, cnx_IA_v2

# --- Base de Datos ---
from database.db import engine
from models import models  # Importa modelos de DB

models.Base.metadata.create_all(bind=engine)  # Crea tablas en la DB si no existen

v1_description = """
**Versión 1.0.0 de la API SafeMine**

Esta es la primera versión operativa de la API de riesgos.
Incluye los siguientes endpoints:
* **/datos/api/alertas/actual**: En base a coordenadas geográficas, toma parámetros de la API OpenWeather y los guarda en un archivo JSON `datos_clima.json`.
* **/data_to_gemini**: Analiza los datos climáticos de `datos_clima.json` 
    y devuelve una lista de alertas generada por IA (De manera General).
* **/data_to_gemini_test**: Analiza los datos climáticos de `datos_clima.json` 
y devuelve una lista de alertas generada por IA bajo categorías (Específica) en un archivo JSON `alertas_generadas.json`.
"""

# --- Configuración ---
app = FastAPI(
    title="SafeMine AI Data Clima",
    version="1.0.0",
    description=v1_description,
    redoc_url=None)
    

# --- Agregar routers ---
app.include_router(data_weather.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA_v2.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(data_sismos.router, prefix="/datos", tags=["Datos Sismos"])

# --- Página Principal ---
@app.get("/",tags=["Ruta /"])
def root():
    return {
        "message": "Sistema SafeMine AI API funcionando correctamente",
        "version": "1.0.0",
        "docs": "/docs"
    }

# --- Ejecutor ---
if __name__ == "__main__":
    print("--- Iniciando Servidor de Datos SafeMine (Solo Datos) ---")
    print(f"URL API Clima: http://127.0.0.1:8000{app.routes[4].path}")
    print(f"URL API Sismos: http://127.0.0.1:8000{app.routes[7].path}")
    print("Documentación:  http://127.0.0.1:8000/docs")
    print("----------------------------------------------------------")
    
    # Esto inicia el servidor
    uvicorn.run(app, host="127.0.0.1", port=8000)