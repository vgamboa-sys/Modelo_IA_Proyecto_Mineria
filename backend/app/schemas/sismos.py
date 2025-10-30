from pydantic import BaseModel, Field
from typing import List, Optional

class SismoItem(BaseModel):
    fecha: Optional[str] = Field(None, description="Fecha/hora reportada por sismologia.cl")
    lugar: str
    magnitud: float
    profundidad_km: Optional[float] = None

class SismosRespuesta(BaseModel):
    fuente: str = "https://www.sismologia.cl/"
    keywords: List[str]
    total: int
    sismos: List[SismoItem]
