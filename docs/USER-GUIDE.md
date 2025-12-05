# Guía de Usuario - Sistema de Sorteo

## Introducción

Bienvenido al Sistema de Sorteo. Esta aplicación le permite realizar sorteos justos y transparentes de manera rápida y sencilla.

## Características Principales

- ✅ Sorteos 100% justos y aleatorios
- ✅ Sin duplicados - cada persona solo puede ganar una vez
- ✅ Animaciones profesionales
- ✅ Exportación de resultados
- ✅ No requiere instalación
- ✅ Funciona completamente en su navegador

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, o Edge)
- Dos archivos CSV:
  - Lista de participantes
  - Lista de premios

## Preparando sus Archivos CSV

### Archivo de Participantes

Cree un archivo CSV con dos columnas: `name` y `ticketnumber`

**Ejemplo** (`participantes.csv`):
```csv
name,ticketnumber
Juan Pérez,001
María González,002
Carlos Rodríguez,003
Ana Martínez,004
Luis Hernández,005
```

**Notas Importantes:**
- La primera fila debe contener los encabezados: `name,ticketnumber`
- Cada participante debe tener un número de boleto único
- Los números de boleto pueden ser números o texto
- Use comas para separar las columnas

### Archivo de Premios

Cree un archivo CSV con una columna: `prize`

**Ejemplo** (`premios.csv`):
```csv
prize
Laptop HP 15"
Mouse Inalámbrico Logitech
Teclado Mecánico
Audífonos Bluetooth
Tarjeta de Regalo $500
```

**Notas Importantes:**
- La primera fila debe contener el encabezado: `prize`
- Un premio por línea
- Los premios se sortearán en el orden en que aparecen

## Pasos para Realizar un Sorteo

### Paso 1: Cargar Archivos

1. Abra la aplicación en su navegador
2. En la sección "Cargar Archivos CSV":
   - Arrastre y suelte el archivo de participantes en la primera zona
   - O haga clic en la zona para seleccionar el archivo
3. Repita para el archivo de premios en la segunda zona
4. Verá confirmaciones verdes cuando los archivos se carguen correctamente

### Paso 2: Vista Previa

1. La aplicación mostrará automáticamente la vista previa
2. Revise:
   - Número total de participantes
   - Número total de premios
   - Lista de los primeros 5 participantes
   - Lista completa de premios
3. Si hay más premios que participantes, verá una advertencia
4. Haga clic en "Iniciar Sorteo" cuando esté listo

### Paso 3: Sorteo en Progreso

1. La aplicación comenzará el sorteo automáticamente
2. Para cada premio:
   - Verá una animación de selección
   - Se revelará el ganador con confetti
   - Se mostrará el progreso general
3. El proceso es completamente automático

### Paso 4: Resultados

1. Al finalizar, verá una tabla con todos los ganadores
2. La tabla muestra:
   - Número de premio
   - Nombre del ganador
   - Número de boleto
   - Premio ganado
3. Opciones disponibles:
   - **Descargar Resultados (CSV)**: Exporta los resultados a Excel
   - **Nuevo Sorteo**: Reinicia la aplicación para otro sorteo

## Descargando los Resultados

1. Haga clic en "Descargar Resultados (CSV)"
2. Se descargará un archivo con nombre `sorteo_resultados_YYYY-MM-DD.csv`
3. Puede abrir este archivo en Excel, Google Sheets, o cualquier programa de hojas de cálculo
4. El archivo contiene: número, ganador, boleto, y premio

## Preguntas Frecuentes

### ¿Es justo el sorteo?

Sí, 100%. La aplicación utiliza la API Web Crypto del navegador, que genera números aleatorios criptográficamente seguros. Cada participante tiene exactamente la misma probabilidad de ganar.

### ¿Puede alguien ganar dos veces?

No. Una vez que un participante gana un premio, automáticamente se remueve del grupo de candidatos para los siguientes premios.

### ¿Qué pasa si tengo más premios que participantes?

La aplicación mostrará una advertencia y solo sorteará el número de premios igual al número de participantes. Los premios extras no se sortearán.

### ¿Se guardan mis datos en algún servidor?

No. Todo el procesamiento ocurre en su navegador. Sus archivos CSV y resultados nunca salen de su computadora.

### ¿Puedo usar números de boleto no consecutivos?

Sí. Los números de boleto pueden ser cualquier texto o número único. Por ejemplo: "A001", "VIP-123", etc.

### ¿Qué tamaño máximo pueden tener mis archivos?

Por razones de rendimiento, recomendamos archivos de hasta 5 MB (aproximadamente 50,000 participantes).

### ¿Puedo pausar o detener el sorteo?

No. Una vez iniciado, el sorteo continúa automáticamente hasta completar todos los premios. Esto garantiza la integridad del proceso.

### ¿Qué navegadores son compatibles?

- Google Chrome 90 o superior
- Mozilla Firefox 88 o superior
- Safari 14 o superior
- Microsoft Edge 90 o superior

## Solución de Problemas

### Error: "El archivo de participantes está vacío"

- Verifique que su archivo CSV tenga datos después del encabezado
- Asegúrese de que el archivo esté guardado como CSV, no como Excel

### Error: "Número de boleto duplicado"

- Revise su archivo de participantes
- Cada número de boleto debe ser único
- El error le indicará en qué fila está el duplicado

### Error: "El CSV debe contener las columnas: name y ticketnumber"

- Verifique que la primera línea de su archivo sea exactamente: `name,ticketnumber`
- Use comas (,) no punto y coma (;)

### Los archivos no se cargan

- Verifique que sus archivos tengan extensión `.csv`
- Intente abrir los archivos en un editor de texto para verificar el formato
- Asegúrese de que no excedan 5 MB

## Consejos y Buenas Prácticas

1. **Pruebe primero**: Haga un sorteo de prueba con pocos participantes antes del evento real
2. **Respalde sus archivos**: Guarde copias de sus archivos CSV
3. **Proyecte la pantalla**: En eventos en vivo, proyecte la aplicación para que todos vean el sorteo
4. **Descargue los resultados inmediatamente**: No olvide descargar el CSV de resultados antes de cerrar el navegador
5. **Use nombres completos**: Incluya nombres y apellidos para evitar confusiones

## Contacto y Soporte

Para soporte técnico o preguntas, por favor abra un issue en el repositorio de GitHub.

---

**¡Buena suerte con su sorteo!**
