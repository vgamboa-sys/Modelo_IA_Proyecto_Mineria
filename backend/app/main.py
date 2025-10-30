import uvicorn  # Para ejecutar el servidor
from fastapi import FastAPI
from routers import data_weather, cnx_IA, cnx_IA_copy, data_sismos

# --- Base de Datos ---
from database.db import engine
from models import models  # Importa modelos de DB

models.Base.metadata.create_all(bind=engine)  # Crea tablas en la DB si no existen


# --- Configuración ---
app = FastAPI(
    title="SafeMine AI Data Clima",
    description="API que obtiene datos de clima y polución desde OWM, estos datos los analiza con Gemini (IA) y entrega recomendaciones de seguridad basads en ellas."
)

# --- Agregar routers ---
app.include_router(data_weather.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA.router, prefix="/datos", tags=["Datos Clima"])
app.include_router(cnx_IA_copy.router, prefix="/datos", tags=["Datos Clima"])
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