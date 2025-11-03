from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertaItem(BaseModel):
    id: int
    fecha: datetime
    tipo_severidad: Optional[str] = None
    titulo: Optional[str] = None
    protocolo: Optional[str] = None
    descripcion: Optional[str] = None
    id_mina: Optional[int] = None
    id_clima: Optional[int] = None
    id_sismo: Optional[int] = None

    class Config:
        from_attributes = True  # equiv. a orm_mode=True en Pydantic v1
