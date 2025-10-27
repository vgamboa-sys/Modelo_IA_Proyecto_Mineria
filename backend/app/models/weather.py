from pydantic import BaseModel
from typing import Optional

# --- Modelos de Datos (Pydantic) ---

class DatosClimaticosMina(BaseModel):
    """Datos crudos del clima y polución obtenidos de OWM."""
    ciudad: str
    temperatura_c: float
    humedad_pct: int
    presion_hpa: int
    visibilidad_mts: int
    nubes_pct: int
    viento_velocidad_ms: float
    viento_direccion_deg: int
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

class RespuestaAlertaCache(BaseModel):
    """Modelo de respuesta para el endpoint principal de la API."""
    alerta_ia: str
    datos_climaticos: Optional[DatosClimaticosMina] = None
    ultima_actualizacion: Optional[str] = None
    error: Optional[str] = None
