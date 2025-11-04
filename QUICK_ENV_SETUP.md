# 🚀 Pasos Rápidos - Configuración Segura de Variables de Entorno

## ⚡ Configuración en 3 Pasos

### 1️⃣ Eliminar .env del repositorio (si existe)

En tu máquina local (PowerShell):

```powershell
cd C:\Users\ivand\OneDrive\Escritorio\Modelo_IA_Proyecto_Mineria

# Si el archivo .env está en el repositorio, eliminarlo
git rm --cached backend/app/.env -f
git commit -m "Remove sensitive .env file from repository"
git push origin production
```

---

### 2️⃣ Configurar variables en el servidor EC2

Opción A - **Script Automático** (Recomendado):

```bash
# Conectarse al servidor
ssh -i tu-key.pem ubuntu@tu-ip-ec2

# Navegar al proyecto
cd /home/ubuntu/safemine

# Dar permisos al script
chmod +x scripts/setup-env.sh

# Ejecutar el script
sudo scripts/setup-env.sh
```

El script te pedirá:

- ✏️ GOOGLE_API_KEY
- ✏️ OPENWEATHER_API_KEY
- ✏️ Credenciales de la base de datos

---

Opción B - **Manual**:

```bash
# Crear el archivo de variables
sudo nano /etc/safemine/environment
```

Pegar este contenido (con tus valores reales):

```bash
GOOGLE_API_KEY=tu_key_real_aqui
OPENWEATHER_API_KEY=tu_key_real_aqui
DATABASE_URL=mysql+pymysql://admin:safemineppj14@safemine.cbmkwgi8u37x.us-east-1.rds.amazonaws.com:3306/safemine
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

Guardar: `Ctrl+O`, `Enter`, `Ctrl+X`

Asegurar permisos:

```bash
sudo chmod 600 /etc/safemine/environment
sudo chown root:root /etc/safemine/environment
```

---

### 3️⃣ Hacer push y verificar

En tu máquina local:

```powershell
git add .
git commit -m "Configure environment variables via systemd"
git push origin production
```

En el servidor (después del despliegue):

```bash
# Verificar que el servicio está corriendo
sudo systemctl status safemine.service

# Probar la API
curl http://localhost:8000/
```

---

## ✅ Verificación Final

```bash
# En el servidor EC2

# 1. Verificar que el archivo existe con permisos seguros
ls -la /etc/safemine/environment
# Debe mostrar: -rw------- 1 root root

# 2. Ver el estado del servicio
sudo systemctl status safemine.service

# 3. Probar que las variables se cargan
sudo journalctl -u safemine.service -n 20
```

---

## 🔐 Beneficios

✅ **Sin .env en Git**: Tus tokens nunca estarán en el repositorio
✅ **Seguro**: Solo root puede leer las variables
✅ **Automático**: systemd carga las variables al iniciar el servicio
✅ **Persistente**: Sobrevive a reinicios del servidor

---

## 📚 Documentación Completa

Para más detalles, consulta: [ENV_SETUP.md](ENV_SETUP.md)
