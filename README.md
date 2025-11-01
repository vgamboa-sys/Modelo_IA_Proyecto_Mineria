# 🦺 SafeMine AI

**SafeMine AI** utiliza Inteligencia Artificial para analizar datos meteorológicos.  
Su objetivo es **generar alertas preventivas diarias y automáticas** para mejorar la **seguridad laboral** en la industria minera.

El proyecto está compuesto por dos módulos principales:

- 🧠 **Backend (API en Python)** → Recolecta datos, los procesa con IA (Gemini) y gestiona la base de datos.
- 💻 **Frontend (React App)** → Interfaz web que consume la API y muestra la alerta periodica al trabajador.

---

## 🛠️ Stack Tecnológico

| Componente        | Tecnología                |
| ----------------- | ------------------------- |
| **Frontend**      | React (Vite) + JavaScript |
| **Backend (API)** | Python 3.13.5             |
| **Framework API** | FastAPI                   |
| **IA**            | Google Gemini             |
| **Base de Datos** | SQLite (local)            |
| **APIs Externas** | OpenWeatherMap            |

---

## 🚀 Instalación y Puesta en Marcha

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/vgamboa-sys/Modelo_IA_Proyecto_Mineria.git
cd Modelo_IA_Proyecto_Mineria
```

---

### 2️⃣ Configuración del Frontend (React)

El frontend se encuentra en la carpeta `/frontend`.

**Navega a la carpeta del frontend:**

```bash
cd frontend
```

**Instala las dependencias de Node:**

```bash
npm install
```

#### 💻 Ejecución — Frontend

Desde la carpeta del frontend:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo.  
Abre el enlace indicado por la consola, por ejemplo:

> 🔗 [http://localhost:5173](http://localhost:5173)

### 3️⃣ Configuración del Backend (API en Python)

La API se encuentra en /backend
Se encarga de recolectar datos, contactar la IA y guardar resultados en la base de datos.

**Instalar dependencias:**

```bash
pip install -r requirements.txt
```

**Configurar variables de entorno:**  
Crea un archivo `.env` en la raíz con tus credenciales:

```bash
# .env
OPENWEATHER_API_KEY="tu-key-de-openweather"
GEMINI_API_KEY="tu-key-de-gemini"
```

#### 💻 Ejecución — Backend

Por ahora la parte para obtener el clima desde la api, en `backend/api_get_clima/`:

Desde la raíz del proyecto:

```bash
python api_weather.py
```

Esto levantará el servidor, para probar abre el enlace indicado por la consola:

> 🌐 [http://127.0.0.1:8000](http://127.0.0.1:8000)

Esto no deberia mostrar nada, solo un mensaje : {"detail":"Not Found"}

Para observar la documentación de la api este es el enlace:

> 🌐 [http://127.0.0.1:8000/docs/](http://127.0.0.1:8000/docs/)

Luego para ver lo que esta mostrando la api directamente:

> 🌐 [http://127.0.0.1:8000/api/alertas/actual](http://127.0.0.1:8000/datos/api/alertas/actual)

---

## 🚀 CI/CD y Despliegue en AWS EC2

Este proyecto cuenta con un pipeline automatizado de CI/CD usando **GitHub Actions** que despliega automáticamente la aplicación en una instancia **AWS EC2 Ubuntu**.

### 📋 Documentación de Despliegue

- **[CHECKLIST.md](CHECKLIST.md)**: Lista de verificación completa antes del primer despliegue
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Guía detallada de despliegue, troubleshooting y comandos útiles

### ⚡ Despliegue Automático

Cada push a la rama `production` ejecuta automáticamente:

1. ✅ Sincronización de archivos con rsync
2. ✅ Creación/actualización del entorno virtual
3. ✅ Instalación de dependencias
4. ✅ Configuración del servicio systemd
5. ✅ Reinicio automático del servicio
6. ✅ Verificación del estado

### 🔧 Comandos Rápidos en el Servidor

```bash
# Ver estado del servicio
sudo systemctl status safemine.service

# Ver logs en tiempo real
sudo journalctl -u safemine.service -f

# Reiniciar el servicio
sudo systemctl restart safemine.service

# Verificar estado (script personalizado)
./scripts/check-service.sh
```

### 🌐 Acceso a la API en Producción

Una vez desplegado, puedes acceder a:

- **API Root**: `http://tu-ip-ec2:8000/`
- **Documentación Interactiva**: `http://tu-ip-ec2:8000/docs`
- **Endpoints**:
  - Datos Clima: `/datos/api/alertas/actual`
  - Datos Sismos: `/datos/api/alertas/sismos`
  - Análisis IA: `/datos/data_to_gemini`

---

## 📁 Estructura del Proyecto

```
Modelo_IA_Proyecto_Mineria/
├── .github/
│   └── workflows/
│       └── main.yml           # Pipeline CI/CD
├── backend/
│   └── app/
│       ├── main.py            # Aplicación FastAPI
│       ├── requirements.txt   # Dependencias Python
│       ├── .env.example       # Ejemplo de variables de entorno
│       ├── database/          # Configuración de BD
│       ├── models/            # Modelos SQLAlchemy
│       ├── routers/           # Endpoints de la API
│       └── schemas/           # Esquemas Pydantic
├── scripts/
│   ├── deploy.sh              # Script de despliegue manual
│   └── check-service.sh       # Verificación del servicio
├── CHECKLIST.md               # Lista de verificación pre-despliegue
├── DEPLOYMENT.md              # Guía de despliegue completa
└── README.md                  # Este archivo
```

---

## 🔐 Configuración de Secrets (GitHub)

Para el CI/CD, configura estos secrets en tu repositorio:

| Secret      | Descripción          | Ejemplo                        |
| ----------- | -------------------- | ------------------------------ |
| `IP_SERVER` | IP pública de EC2    | `54.123.45.67`                 |
| `HOST`      | Usuario SSH          | `ubuntu`                       |
| `KEY`       | Llave privada (.pem) | Contenido completo del archivo |
| `PORT`      | Puerto SSH           | `22`                           |

---

## 🛡️ Seguridad

- ✅ El archivo `.env` está en `.gitignore`
- ✅ Las API keys se manejan mediante variables de entorno
- ✅ La llave SSH solo se almacena en GitHub Secrets
- ✅ El servicio se ejecuta con usuario no privilegiado
- ✅ Auto-reinicio configurado en caso de fallos

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es parte de un proyecto académico/profesional de la minería.

---

_"Prevenir con datos es salvar vidas."_
