# Archivo: main.py

import uvicorn  # Para ejecutar el servidor
from fastapi import FastAPI
from routers import data_weather, cnx_IA, cnx_IA_copy

# --- Configuración ---
app = FastAPI(
    title="SafeMine AI Data Clima",
    description="API que obtiene datos de clima y polución desde OWM, estos datos los analiza con Gemini (IA) y entrega recomendaciones de seguridad basads en ellas."
)

# --- Agregar routers ---
app.include_router(data_weather.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA_copy.router, prefix="/datos", tags=["Datos Clima"])

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
    print(f"URL API: http://127.0.0.1:8000{app.routes[4].path}")
    print("Documentación:  http://127.0.0.1:8000/docs")
    print("----------------------------------------------------------")
    
    # Esto inicia el servidor
    uvicorn.run(app, host="127.0.0.1", port=8000)