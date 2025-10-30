# 🦺 SafeMine AI

**SafeMine AI** utiliza Inteligencia Artificial para analizar datos meteorológicos.  
Su objetivo es **generar alertas preventivas diarias y automáticas** para mejorar la **seguridad laboral** en la industria minera.

El proyecto está compuesto por dos módulos principales:

- 🧠 **Backend (API en Python)** → Recolecta datos, los procesa con IA (Gemini) y gestiona la base de datos.  
- 💻 **Frontend (React App)** → Interfaz web que consume la API y muestra la alerta periodica al trabajador.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-------------|-------------|
| **Frontend** | React (Vite) + JavaScript |
| **Backend (API)** | Python 3.13.5 |
| **Framework API** | FastAPI |
| **IA** | Google Gemini |
| **Base de Datos** | SQLite (local) |
| **APIs Externas** | OpenWeatherMap |

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

*“Prevenir con datos es salvar vidas.”*

⠀⠀⠀⠀⢀⣤⠤⣄⠀⠀⠀⠀⣠⠤⣄⠀⠀⠀
⠀⠀⠀⢠⠞⠀⠀⠈⢷⠀⠀⡜⠃⠀⠈⢳⠀⠀
⠀⠀⠀⣾⠀⠀⠀⠀⠘⡇⢰⠅⠀⠀⠀⠸⡇⠀
⠀⠀⠀⣿⠀⠀⠀⠀⠀⡇⣾⠀⠀⠀⠀⢸⠃⠀
⠀⠀⠀⢹⡀⠀⠀⠀⠀⡇⣿⠀⠀⠀⠀⡾⠀⠀
⠀⠀⠀⠸⡇⠀⠀⠀⠀⠷⠿⠀⠀⠀⢰⠇⠀⠀
⠀⢀⡴⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⡀⠀
⢰⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄
⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷
⢹⠀⠀⠀⢰⡆⠀⠀⠀⠀⠀⠀⢀⣄⠀⠀⠀⡟
⠈⢧⡀⠀⠀⠀⠀⠀⢄⡀⣀⠀⠀⠁⠀⠀⣸⠃
⠀⠈⠻⢦⣀⠀⠀⠀⠚⠙⠂⠀⠀⠀⣀⡴⠋⠀
⠀⠀⠀⠀⠈⠉⠓⠒⠲⠶⠶⠒⠒⠋⠁⠀⠀⠀
