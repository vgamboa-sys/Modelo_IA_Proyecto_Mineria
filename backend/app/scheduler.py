# scheduler.py
import logging
import os

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger("safemine_scheduler")

# Usa la zona horaria de Chile
scheduler = BackgroundScheduler(timezone="America/Santiago")

#Helper para llamar endpoints GET, POST y loguear resultado.
def _call_get(url: str, label: str) -> bool:
    try:
        logger.info("[Scheduler] Llamando %s -> %s", label, url)
        resp = requests.get(url, timeout=40)
        resp.raise_for_status()
        logger.info("[Scheduler] OK %s: status=%s", label, resp.status_code)
        return True
    except Exception as e:
        logger.exception("[Scheduler] Error en %s: %s", label, e)
        return False


def _call_post(url: str, label: str) -> bool:
    try:
        logger.info("[Scheduler] Llamando %s -> %s", label, url)
        resp = requests.post(url, timeout=40)
        resp.raise_for_status()
        logger.info("[Scheduler] OK %s: status=%s", label, resp.status_code)
        return True
    except Exception as e:
        logger.exception("[Scheduler] Error en %s: %s", label, e)
        return False


def _job_ciclo_alerta():
    """
    Ciclo completo cada x minutos:
      1) /datos/api/alertas/actual   -> genera datos_clima.json
      2) /datos/api/alertas/sismos   -> genera datos_sismos.json
      3) /datos/data_to_gemini_test  -> lee JSON(s), genera alerta(s) y las guarda en BD
    """

    base_url = os.getenv("SCHED_BASE_URL", "http://127.0.0.1:8000")

    clima_url = f"{base_url}/datos/api/alertas/actual"
    sismos_url = f"{base_url}/datos/api/alertas/sismos"
    gemini_url = f"{base_url}/datos/data_to_gemini_test"  # ajusta si tu ruta es distinta

    # 1) Clima
    if not _call_get(clima_url, "CLIMA"):
        logger.warning("[Scheduler] Falló CLIMA, se aborta ciclo de alerta")
        return

    # 2) Sismos
    if not _call_get(sismos_url, "SISMOS"):
        logger.warning("[Scheduler] Falló SISMOS, se aborta ciclo de alerta")
        return

    # 3) Gemini
    if not _call_post(gemini_url, "GEMINI_ALERTA"):
        logger.warning("[Scheduler] Falló GEMINI_ALERTA")
        return

    logger.info("[Scheduler] Ciclo completo CLIMA + SISMOS + GEMINI ejecutado OK")


def start():
    enabled = os.getenv("SCHED_ENABLED", "1") == "1"

    if not enabled:
        logger.warning("[Scheduler] Deshabilitado porque SCHED_ENABLED != 1")
        return

    scheduler.add_job(
        _job_ciclo_alerta,
        trigger=IntervalTrigger(minutes=5),  # cada x minutos
        id="job_ciclo_alerta",
        replace_existing=True,
        coalesce=True,
        max_instances=1,
        misfire_grace_time=300,
    )

    scheduler.start()
    logger.info("[Scheduler] Iniciado: ciclo cada 15 minutos")


def stop():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[Scheduler] Detenido")