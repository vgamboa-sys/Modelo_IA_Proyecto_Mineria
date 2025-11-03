from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.db import get_db
from models import models
from schemas.alertas import AlertaItem

router = APIRouter()

@router.get("/alertas", response_model=List[AlertaItem], summary="Lista alertas desde la BD")
def listar_alertas(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200, description="Cantidad máxima de alertas"),
    offset: int = Query(0, ge=0, description="Offset para paginación"),
    severidad: Optional[str] = Query(None, description="Filtrar por tipo_severidad (Alta/Media/Baja)"),
    id_mina: Optional[int] = Query(None, description="Filtrar por id_mina")
):
    """
    Devuelve alertas ordenadas por fecha descendente (últimas primero).
    Sirve para historial.
    """

    query = db.query(models.Alerta).order_by(models.Alerta.fecha.desc())

    if severidad:
        query = query.filter(models.Alerta.tipo_severidad == severidad)
    if id_mina:
        query = query.filter(models.Alerta.id_mina == id_mina)

    alertas = query.offset(offset).limit(limit).all()
    return alertas
