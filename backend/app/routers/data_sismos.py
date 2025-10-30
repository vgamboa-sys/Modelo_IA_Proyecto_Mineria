import json
import re
from pathlib import Path
from typing import List

import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, Query

from schemas.sismos import SismoItem, SismosRespuesta

router = APIRouter()    

# Archivo de salida: al lado de datos_clima.json
THIS_DIR = Path(__file__).parent
OUTFILE = THIS_DIR / "datos_sismos.json"

DEFAULT_KEYWORDS = ["collahuasi", "pica", "camiña", "ollague", "ollagüe", "socaire", "calama"]

def _to_float(text: str) -> float:
    """
    Extrae el primer número (con punto o coma) de un string y lo convierte a float.
    Lanza ValueError si no hay número reconocido.
    """
    m = re.search(r"[-+]?\d+[.,]?\d*", text.replace(",", "."))
    if not m:
        raise ValueError(f"No num in '{text}'")
    return float(m.group(0))

def _scrape_sismologia(keywords: List[str]) -> List[SismoItem]:
    url = "https://www.sismologia.cl/"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; SafeMineAI/1.0; +https://example.org)"
    }

    try:
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error consultando sismologia.cl: {e}")

    soup = BeautifulSoup(r.text, "html.parser")
    tabla = soup.find("table", class_="sismologia")
    if not tabla:
        raise HTTPException(status_code=502, detail="No se encontró tabla 'sismologia' en la página.")

    filas = tabla.find_all("tr")[1:]  # omite encabezado
    resultados: List[SismoItem] = []

    for fila in filas:
        celdas = fila.find_all("td")
        if len(celdas) != 3:
            continue

        # Celda 0: "fecha<br>lugar"
        fecha_txt = None
        lugar_txt = ""
        br_tag = celdas[0].find("br")
        if br_tag:
            # fecha es el contenido antes del <br>, lugar después
            fecha_txt = celdas[0].text.split("\n")[0].strip()
            if br_tag.next_sibling:
                lugar_txt = str(br_tag.next_sibling).strip()

        # Celda 1: profundidad (ej: "97.8 km")
        profundidad_txt = celdas[1].get_text(strip=True)
        profundidad_km = None
        try:
            profundidad_km = _to_float(profundidad_txt)
        except ValueError:
            pass

        # Celda 2: magnitud (ej: "3.4 Ml")
        magnitud_txt = celdas[2].get_text(strip=True)
        try:
            magnitud = _to_float(magnitud_txt)
        except ValueError:
            continue

        if not lugar_txt:
            continue

        # Filtrado por keywords (case-insensitive)
        lugar_lower = lugar_txt.lower()
        if any(k in lugar_lower for k in keywords):
            resultados.append(
                SismoItem(
                    fecha=fecha_txt,
                    lugar=lugar_txt,
                    magnitud=magnitud,
                    profundidad_km=profundidad_km,
                )
            )

    return resultados

def _guardar_json(data: SismosRespuesta) -> None:
    OUTFILE.write_text(
        json.dumps(data.model_dump(), indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

@router.get("/api/alertas/sismos", response_model=SismosRespuesta, summary="Obtiene sismos cercanos y guarda JSON")
def sismos_actual(
    keywords: List[str] = Query(default=DEFAULT_KEYWORDS, description="Lista de palabras clave para filtrar lugares")
):
    sismos = _scrape_sismologia(keywords)
    respuesta = SismosRespuesta(keywords=keywords, total=len(sismos), sismos=sismos)
    _guardar_json(respuesta)
    return respuesta
