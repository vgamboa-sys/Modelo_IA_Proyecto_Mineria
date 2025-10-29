import datetime
from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from database.db import Base

# Modelo para la tabla Ciudad
class Ciudad(Base):
    __tablename__ = "ciudad"
    id = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, unique=False, index=True)

    # Relación: Una ciudad puede tener múltiples minas
    minas = relationship("Mina", back_populates="ciudad")

# Modelo para la tabla Mina
class Mina(Base):
    __tablename__ = "mina"
    id = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String, index=True)
    direccion = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

    # Clave foránea a Ciudad
    id_ciudad = Column(BigInteger, ForeignKey("ciudad.id"))

    # Relaciones
    ciudad = relationship("Ciudad", back_populates="minas")
    alertas = relationship("Alerta", back_populates="mina")
    climas = relationship("Clima", back_populates="mina")
    sismos = relationship("Sismos", back_populates="mina")

# Modelo para la tabla Sismos
class Sismos(Base):
    __tablename__ = "sismos"
    id = Column(BigInteger, primary_key=True, index=True)
    lugar = Column(String, nullable=True)
    fecha = Column(Date, default=datetime.date.today)
    magnitud = Column(Float)
    profundidad = Column(Float)

    # Clave foránea a Mina 
    id_mina = Column(BigInteger, ForeignKey("mina.id"), nullable=True)

    # Relaciones
    mina = relationship("Mina", back_populates="sismos")
    alertas = relationship("Alerta", back_populates="sismo")

# Modelo para la tabla Clima
class Clima(Base):
    __tablename__ = "clima"
    id = Column(BigInteger, primary_key=True, index=True)
    fecha = Column(Date, default=datetime.date.today)

    # Clave foránea a Mina
    id_mina = Column(BigInteger, ForeignKey("mina.id"))

    temperatura_c = Column(Float)
    humedad_pct = Column(Float)
    presion_hpa = Column(Float)
    visibilidad_mts = Column(Float)
    nubes_pct = Column(Float)
    viento_velocidad_ms = Column(Float)
    viento_direccion_deg = Column(Float)
    viento_rafaga_ms = Column(Float)
    lluvia_1h_mm = Column(Float)
    nieve_1h_mm = Column(Float)
    polucion_pm10 = Column(Float)
    polucion_pm2_5 = Column(Float)
    polucion_co = Column(Float)
    polucion_so2 = Column(Float)
    polucion_no2 = Column(Float)
    polucion_o3 = Column(Float)
    polucion_nh3 = Column(Float)

    # Relaciones
    mina = relationship("Mina", back_populates="climas")
    alertas = relationship("Alerta", back_populates="clima")

# Modelo para la tabla Alerta
class Alerta(Base):
    __tablename__ = "alerta"
    id = Column(BigInteger, primary_key=True, index=True)
    fecha = Column(Date, primary_key=True, default=datetime.date.today)
    tipo_severidad = Column(Text, nullable=True)
    titulo = Column(Text, nullable=True)
    protocolo = Column(Text, nullable=True)
    descripcion = Column(String, nullable=True)

    # Claves foráneas
    id_mina = Column(BigInteger, ForeignKey("mina.id"))
    id_clima = Column(BigInteger, ForeignKey("clima.id"), nullable=True)
    id_sismo = Column(BigInteger, ForeignKey("sismos.id"), nullable=True)

    # Relaciones
    mina = relationship("Mina", back_populates="alertas")
    clima = relationship("Clima", back_populates="alertas")
    sismo = relationship("Sismos", back_populates="alertas")