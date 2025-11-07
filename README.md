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

Para iniciar el servidor backend, se debe iniciar desde la ruta backend/app el siguiente comando:

```bash
uvicorn main:app
```
<img width="419" height="87" alt="image" src="https://github.com/user-attachments/assets/37d19b90-1acd-4c11-a144-200a3af89ff5" />

En la ruta

> 🌐 [http://127.0.0.1:8000](http://127.0.0.1:8000)

Debe mostrar un json de bienvenida que indica que el servidor se esta ejecutando correctamente.

Para observar la documentación de la api, el enlace para swagger es:

> 🌐 [http://127.0.0.1:8000/docs/](http://127.0.0.1:8000/docs/)

---

🪨 *“Prevenir con datos es salvar vidas.”*
