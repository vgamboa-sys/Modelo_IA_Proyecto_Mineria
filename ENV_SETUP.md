# 🔐 Configuración Segura de Variables de Entorno

## 🎯 Objetivo

Las variables de entorno (API keys, contraseñas) se almacenan **SOLO en el servidor EC2**, nunca en el repositorio Git.

---

## 📋 Configuración Inicial en el Servidor

### 1. Conectarse al servidor EC2

```bash
ssh -i tu-key.pem ubuntu@tu-ip-ec2
```

### 2. Crear el archivo de variables de entorno

```bash
# Crear el archivo con permisos seguros
sudo nano /etc/safemine/environment
```

### 3. Agregar tus variables de entorno

Copia y pega este contenido (reemplaza con tus valores reales):

```bash
# API Keys - SafeMine Backend
GOOGLE_API_KEY=tu_google_api_key_real_aqui
OPENWEATHER_API_KEY=tu_openweather_api_key_real_aqui

# Base de datos MySQL en AWS RDS
DATABASE_URL=mysql+pymysql://admin:safemineppj14@safemine.cbmkwgi8u37x.us-east-1.rds.amazonaws.com:3306/safemine

# Configuración de la aplicación
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

**Guardar**: `Ctrl + O`, `Enter`, `Ctrl + X`

### 4. Asegurar los permisos del archivo

```bash
# Solo el usuario ubuntu y root pueden leer el archivo
sudo chmod 600 /etc/safemine/environment
sudo chown root:root /etc/safemine/environment
```

### 5. Verificar la configuración

```bash
# Ver el contenido (requiere sudo)
sudo cat /etc/safemine/environment

# Verificar permisos
ls -la /etc/safemine/environment
# Debería mostrar: -rw------- 1 root root
```

---

## 🔄 El servicio systemd carga automáticamente las variables

El archivo `/etc/systemd/system/safemine.service` tiene esta línea:

```ini
EnvironmentFile=/etc/safemine/environment
```

Esto hace que todas las variables del archivo se carguen automáticamente cuando el servicio inicia.

---

## ✅ Verificar que las variables se carguen correctamente

### Opción 1: Ver las variables del proceso

```bash
# Obtener el PID del proceso
sudo systemctl status safemine.service | grep "Main PID"

# Ver las variables de entorno del proceso (reemplaza PID con el número real)
sudo cat /proc/PID/environ | tr '\0' '\n'
```

### Opción 2: Probar desde Python

```bash
cd /home/ubuntu/safemine/backend/app
source ../../venv/bin/activate

python3 << 'EOF'
import os
print("DATABASE_URL:", os.getenv("DATABASE_URL", "NO CONFIGURADA"))
print("GOOGLE_API_KEY:", "✓ Configurada" if os.getenv("GOOGLE_API_KEY") else "✗ NO configurada")
print("OPENWEATHER_API_KEY:", "✓ Configurada" if os.getenv("OPENWEATHER_API_KEY") else "✗ NO configurada")
EOF
```

---

## 🔄 Actualizar variables de entorno

Si necesitas cambiar alguna variable:

```bash
# 1. Editar el archivo
sudo nano /etc/safemine/environment

# 2. Guardar cambios (Ctrl+O, Enter, Ctrl+X)

# 3. Reiniciar el servicio para aplicar cambios
sudo systemctl restart safemine.service

# 4. Verificar que el servicio esté corriendo
sudo systemctl status safemine.service
```

---

## 🗑️ Eliminar .env del proyecto local

En tu máquina local, **NO versiones** el archivo `.env`:

```bash
# El .gitignore ya tiene estas líneas:
.env
.env.*
backend/app/.env
```

### Si ya subiste .env al repositorio por error:

```bash
# En tu máquina local
cd C:\Users\ivand\OneDrive\Escritorio\Modelo_IA_Proyecto_Mineria

# Remover .env del historial de Git
git rm --cached backend/app/.env
git commit -m "Remove .env file from repository"
git push origin production

# Eliminar el archivo local (opcional)
rm backend/app/.env
```

---

## 🔒 Ventajas de este método

✅ **Variables fuera del código**: No hay riesgo de subir tokens al repositorio
✅ **Centralizado**: Todas las variables en un solo archivo en el servidor
✅ **Seguro**: Solo root y el servicio pueden leer el archivo
✅ **Persistente**: Las variables sobreviven a reinicios del servidor
✅ **Fácil de actualizar**: Solo editas un archivo y reinicias el servicio
✅ **No afecta al código**: Tu aplicación sigue usando `os.getenv()` normalmente

---

## 📝 Checklist de Seguridad

- [ ] Archivo `/etc/safemine/environment` creado con las variables
- [ ] Permisos del archivo configurados a 600 (solo lectura para root)
- [ ] Archivo `.env` local está en `.gitignore`
- [ ] Archivo `.env` eliminado del repositorio Git (si estaba versionado)
- [ ] Servicio systemd reiniciado y funcionando
- [ ] Variables de entorno verificadas con los comandos de prueba

---

## 🆘 Troubleshooting

### El servicio no carga las variables

```bash
# Verificar que el archivo existe
ls -la /etc/safemine/environment

# Verificar la sintaxis del archivo (no debe tener espacios alrededor del =)
sudo cat /etc/safemine/environment

# Ver logs del servicio
sudo journalctl -u safemine.service -n 50
```

### Error de permisos

```bash
# Reconfigurar permisos
sudo chown root:root /etc/safemine/environment
sudo chmod 600 /etc/safemine/environment

# Reiniciar servicio
sudo systemctl restart safemine.service
```

### Variables no se cargan en la aplicación

Asegúrate de que tu código Python use `os.getenv()`:

```python
import os
DATABASE_URL = os.getenv("DATABASE_URL", "default_value")
```

---

**Última actualización**: Noviembre 2025
