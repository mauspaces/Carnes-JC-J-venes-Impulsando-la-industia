# ANTEPROYECTO

**Programa:** Jóvenes Impulsando la Industria 2026 — Hermosillo
**Empresa:** Carnes JC · **Sector:** Agroindustria y Alimentos
**Reto:** Gestión y Administración de Inventarios
**Nombre del proyecto (propuesta):** *UBICA-JC: Sistema de ubicación inteligente y trazabilidad por lote para cámaras de congelación*
**Equipo:** Héctor [apellidos] · Mauricio [apellidos] · [Nombre] Pazos — [Institución / carreras]
**Maestro tutor:** [nombre]

> Marcas `[ ]` = dato pendiente de confirmar. Borrador v0.

---

## Objetivo

Diseñar y validar, mediante una prueba piloto en una cámara de congelación de Carnes JC, un sistema de ubicación inteligente que vincule cada caja y tarima con su ubicación física, lote y fecha de producción, permitiendo localizar el producto con mayor rapidez y precisión y asegurar la rotación de lotes por fecha (primero en caducar, primero en salir), en un periodo de 7 semanas.

## Objetivos Específicos

1. **Diagnosticar** el proceso actual de recepción, acomodo y búsqueda de producto en la cámara piloto, midiendo una línea base de tiempos de localización, errores y movimientos innecesarios.
2. **Diseñar un esquema de codificación de ubicaciones** (cámara–rack–nivel–posición) con etiquetas e identificadores resistentes a -18 °C, que dé a cada caja y tarima una "dirección" única y trazable.
3. **Desarrollar un sistema de registro y consulta** que asocie producto, lote, fecha de producción y ubicación, tomando como fuente los datos del ERP de la empresa (Odoo) sin modificarlo, y que funcione aun sin conexión a internet.
4. **Implementar un motor de asignación automática de ubicaciones** que sugiera dónde acomodar cada entrada según capacidad, compatibilidad de producto y fecha de caducidad, evitando posiciones ocupadas.
5. **Construir un visor gráfico (mapa 2D/3D) de la cámara** que muestre en segundos dónde está cada lote y resalte con semáforo los lotes próximos a vencer.
6. **Ejecutar una prueba piloto** en una de las 6 cámaras con personal de almacén capacitado, y medir el antes y después con los mismos indicadores.
7. **Entregar un plan de escalamiento** a las 6 cámaras, con costos, beneficios, limitaciones y esquema de sostenimiento.

## Planteamiento del problema

Carnes JC es una empresa 100% sonorense con cerca de 40 años de trayectoria y alrededor de 450 colaboradores, con operación en Hermosillo, Nogales y Cd. Obregón, presencia en seis estados del país y exportaciones a Japón, Estados Unidos, Canadá, Rusia y Vietnam. Su almacén frigorífico cuenta con 6 cámaras que operan a aproximadamente **-18 °C**, donde se resguarda producto cárnico en cajas y tarimas.

Actualmente el control de inventario en las cámaras es **parcial**: las cajas y tarimas se manejan sin una integración suficiente entre su ubicación física y el registro digital. Como consecuencia:

- **Tiempos de búsqueda elevados:** localizar un producto o lote específico depende de la memoria del personal y de recorrer pasillos, lo que genera movimientos innecesarios y retrabajos frecuentes.
- **Riesgo en vida de anaquel:** sin saber con certeza dónde está cada lote, es difícil garantizar que salga primero el producto más próximo a vencer, lo que aumenta el riesgo de merma.
- **Impacto en inocuidad y productividad:** cada minuto adicional de búsqueda implica más tiempo con puertas abiertas y personal expuesto a temperaturas de congelación, mayor consumo energético y menor capacidad de despacho.
- **Trazabilidad limitada:** la identificación precisa de producto, lote y fecha de producción es crítica para responder a auditorías, retiros de producto y requisitos de los mercados de exportación.

**Pregunta del reto:** *¿Cómo mejorar la identificación, ubicación y gestión del inventario para hacer más eficiente la operación de los almacenes?*

**Justificación:** resolver este problema reducirá tiempos operativos y mermas, fortalecerá la trazabilidad que exigen los clientes nacionales e internacionales, y mejorará las condiciones de trabajo del personal de cámaras. Si no se atiende, el crecimiento en volumen multiplicará los tiempos de búsqueda, los errores de surtido y el riesgo de producto caducado.

## Propuesta de mejora

**UBICA-JC** convierte cada cámara en un almacén "con dirección": cada posición tiene un código, cada caja o tarima queda ligada a esa posición, y el sistema sabe en todo momento qué hay, dónde está y cuándo vence.

### ¿Cómo funciona? (flujo operativo)

1. **Entrada:** al recibir producto, el operador escanea la etiqueta de la caja o tarima. El sistema obtiene de Odoo el producto, lote y fecha de producción.
2. **Asignación automática:** el sistema sugiere la mejor posición disponible según capacidad, tipo de producto y fecha de caducidad (los lotes que vencen antes quedan más accesibles).
3. **Confirmación:** el operador acomoda y escanea el código de la posición. La ubicación queda registrada con fecha, hora y responsable.
4. **Búsqueda:** se escribe o escanea el producto o lote, y el **mapa de la cámara** muestra la posición exacta y la ruta.
5. **Salida:** el sistema indica qué lote debe salir primero (FEFO) y registra el movimiento.
6. **Sin internet:** la consulta sigue funcionando con la última copia local, mostrando la hora de la última sincronización.

### Componentes

| Componente | Descripción |
|---|---|
| Codificación de ubicaciones | Nomenclatura Cámara–Rack–Nivel–Posición con etiquetas de polipropileno y adhesivo para congelación. |
| Identificación de producto | Código de barras / QR por caja o tarima ligado a producto, lote y fecha. Lectores aptos para baja temperatura. |
| Sistema de registro y consulta | Aplicación web adaptable a celular, tablet o lector; base de datos en servidor local. |
| Integración con Odoo | Lectura de productos y lotes **sin escribir** en el ERP, para no afectar la operación actual. |
| Motor de asignación | Reglas configurables: capacidad, compatibilidad, posiciones ocupadas y prioridad por caducidad. |
| Visor de cámara (2D/3D) | Mapa interactivo con ocupación, ubicación del lote buscado y semáforo de caducidad. |
| Tablero de indicadores | Tiempos de búsqueda, ocupación, exactitud de inventario y lotes próximos a vencer. |

### ¿Qué la hace innovadora?

- **Mapa visual de la cámara:** el operador ve dónde está el producto en lugar de recordarlo.
- **Acomodo inteligente orientado a caducidad:** la rotación de lotes se diseña desde la entrada, no se corrige a la salida.
- **Diseñada para -18 °C:** materiales, lectores y flujo pensados para operar con guantes y minimizar el tiempo en cámara.
- **Funciona sin internet** y **no modifica Odoo:** adopción de bajo riesgo para la empresa.
- **Escalable:** se valida en 1 cámara y se replica a las 6 con el mismo modelo.

### Alcance

Incluye diagnóstico, diseño, desarrollo y validación del sistema en **una cámara piloto**, capacitación del personal involucrado, manual de usuario, análisis costo-beneficio y plan de escalamiento. No incluye la compra de equipo (servidor, lectores), que corresponde a Carnes JC; el equipo entregará la cotización y, si el equipo definitivo no está disponible, el piloto operará en un equipo provisional autorizado en la red local.

### Impacto esperado

- **Económico:** permitirá reducir horas-hombre de búsqueda y la merma por producto caducado o no localizado.
- **Operativo:** contribuirá a despachos más rápidos y a un inventario confiable entre lo físico y lo digital.
- **Calidad e inocuidad:** fortalecerá la trazabilidad por lote y la rotación por fecha, clave para auditorías y exportación.
- **Social:** reducirá el tiempo de exposición del personal a temperaturas de congelación.
- **Ambiental:** menos tiempo de puertas abiertas se traduce en menor consumo energético de refrigeración.

## Metas

Las metas se confirmarán con Carnes JC tras medir la línea base en la semana 1. Se proponen como compromiso mínimo:

| # | Meta | Indicador | Cómo se mide |
|---|---|---|---|
| 1 | Reducir **al menos 50%** el tiempo promedio de localización de producto en la cámara piloto. | % reducción = (t. inicial − t. piloto) / t. inicial × 100 | 20 búsquedas antes y 20 después, mismas condiciones; desde la solicitud hasta la confirmación física. |
| 2 | **100%** de las posiciones de la cámara piloto codificadas y de las cajas/tarimas del piloto con ubicación registrada. | Posiciones etiquetadas / posiciones totales | Recorrido de verificación. |
| 3 | Exactitud de ubicación **≥ 95%** entre el sistema y lo físico. | Ubicaciones correctas / ubicaciones verificadas | Conteo cíclico por muestreo. |
| 4 | **0 conflictos** de asignación (dos productos en una misma posición). | Número de conflictos | Registro del sistema durante el piloto. |
| 5 | **100%** de las salidas del piloto con sugerencia FEFO. | Salidas con lote sugerido / salidas totales | Registro de movimientos. |
| 6 | Consulta disponible **sin internet** en el 100% de las pruebas de corte. | Pruebas exitosas / pruebas realizadas | Simulación de corte de red. |
| 7 | Cumplimiento del plan **≥ 90%** cada semana. | PPC y PAER | Revisión semanal del equipo. |

## Cronograma (7 semanas)

Ejecución del 13 de octubre al 27 de noviembre de 2026. Capacidad estimada: 3 integrantes × 15 h/semana.

| Sem. | Fechas | Fase | Actividades principales | Responsable | Entregable / hito |
|---|---|---|---|---|---|
| S1 | 13–16 oct | Diagnóstico y línea base | Levantamiento físico de la cámara piloto; mapeo del proceso actual; medición de 20 búsquedas; revisión de datos en Odoo; acordar reglas de ubicación y criterios de aceptación con JC. | Mauricio / Pazos / Héctor | Línea base y alcance firmado |
| S2 | 19–23 oct | Diseño | Esquema de codificación de ubicaciones; prueba de etiquetas y lectores a -18 °C; arquitectura del sistema y modelo de datos; cotización de equipo. | Mauricio / Héctor / Pazos | Diseño técnico y cotización |
| S3 | 26–30 oct | Desarrollo I | Registro de cajas y ubicaciones; lectura de Odoo; base de datos local; etiquetado de la cámara piloto. | Héctor / Mauricio | Registro funcional |
| S4 | 3–6 nov | Desarrollo II | Motor de asignación automática (capacidad + caducidad); visor 2D/3D de la cámara; casos de prueba. | Héctor / Mauricio | Demostración de asignación y visor |
| S5 | 9–13 nov | Integración y pruebas | Flujo completo; consulta sin internet; respaldo y recuperación; manual de usuario; capacitación. | Pazos / Héctor | Sistema listo para piloto |
| S6 | 17–20 nov | Prueba piloto | Operación en cámara con personal de JC; soporte e incidencias; medición de 20 búsquedas. | Mauricio / Héctor / Pazos | Piloto medido |
| S7 | 23–27 nov | Cierre y sostenimiento | Análisis de resultados; costo-beneficio; plan de escalamiento a 6 cámaras; informe final y presentación. | Equipo completo | Entrega final (27 nov) |

**Seguimiento transversal:** revisión semanal de avance con PPC (tareas completadas / programadas) y PAER (acciones realizadas / comprometidas), control de cambios y reporte a Carnes JC.
