/* ===== ANEXO A · ISO/IEC 27001:2022 =====
   93 controles agrupados en 4 temas. Formato: id|nombre|propósito.
   Se usan como catálogo consultable y como referencia de cada decisión. */
const CONTROL_RAW = `
A.5.1|Políticas de seguridad de la información|La dirección aprueba, publica y revisa políticas alineadas con el negocio y el riesgo.
A.5.2|Roles y responsabilidades de seguridad|Asignar y comunicar responsabilidades para que cada control tenga un dueño.
A.5.3|Segregación de funciones|Separar funciones incompatibles para reducir fraude, error y abuso de privilegios.
A.5.4|Responsabilidades de la dirección|Exigir que la dirección apoye la seguridad y rinda cuentas por el SGSI.
A.5.5|Contacto con autoridades|Mantener contacto con autoridades y reguladores relevantes.
A.5.6|Contacto con grupos de interés especial|Participar en comunidades y foros profesionales de seguridad.
A.5.7|Inteligencia de amenazas|Recopilar y analizar información sobre amenazas para anticipar riesgos.
A.5.8|Seguridad de la información en la gestión de proyectos|Integrar requisitos de seguridad en proyectos y cambios.
A.5.9|Inventario de información y activos asociados|Identificar activos, asignar propietarios y mantener el inventario actualizado.
A.5.10|Uso aceptable de información y activos|Definir reglas claras de uso aceptable de información y equipos.
A.5.11|Devolución de activos|Recuperar activos al terminar la relación laboral o contractual.
A.5.12|Clasificación de la información|Clasificar la información según sensibilidad, valor y requisitos legales.
A.5.13|Etiquetado de la información|Etiquetar la información conforme al esquema de clasificación.
A.5.14|Transferencia de información|Proteger la información en tránsito y formalizar acuerdos de transferencia.
A.5.15|Control de acceso|Definir reglas de acceso basadas en negocio, riesgo y mínimo privilegio.
A.5.16|Gestión de identidades|Gestionar el ciclo de vida completo de las identidades.
A.5.17|Información de autenticación|Proteger secretos y gestionar su asignación, rotación y custodia.
A.5.18|Derechos de acceso|Otorgar, revisar y revocar accesos de forma oportuna y trazable.
A.5.19|Seguridad en las relaciones con proveedores|Gestionar los riesgos de la cadena de suministro de información.
A.5.20|Requisitos de seguridad en acuerdos con proveedores|Incluir requisitos y responsabilidades de seguridad en los contratos.
A.5.21|Seguridad en la cadena de suministro TIC|Gestionar riesgos de proveedores TIC y de sus subproveedores.
A.5.22|Monitoreo y revisión de servicios de proveedores|Supervisar el desempeño, los cambios y los incidentes del proveedor.
A.5.23|Seguridad en el uso de servicios en la nube|Gestionar la seguridad según el modelo de servicio y los datos implicados.
A.5.24|Planificación y preparación de la gestión de incidentes|Planificar roles, procedimientos y canales de respuesta.
A.5.25|Evaluación y decisión sobre eventos de seguridad|Evaluar eventos y decidir si constituyen incidentes.
A.5.26|Respuesta a incidentes de seguridad|Contener, erradicar, recuperar y comunicar según el procedimiento.
A.5.27|Aprendizaje de incidentes|Extraer lecciones, corregir causas y mejorar los controles.
A.5.28|Recolección de evidencia|Preservar evidencia con integridad y cadena de custodia.
A.5.29|Seguridad durante la interrupción|Mantener controles de seguridad durante disrupciones.
A.5.30|Preparación TIC para la continuidad del negocio|Planificar, probar y revisar la continuidad de los servicios TIC.
A.5.31|Requisitos legales, estatutarios, regulatorios y contractuales|Identificar, documentar y cumplir las obligaciones aplicables.
A.5.32|Derechos de propiedad intelectual|Proteger la propiedad intelectual y el uso legítimo de software.
A.5.33|Protección de registros|Proteger registros contra pérdida, alteración y acceso no autorizado.
A.5.34|Privacidad y protección de datos personales|Cumplir la ley y las políticas de privacidad en todo el ciclo de vida.
A.5.35|Revisión independiente de la seguridad|Revisar el SGSI de forma independiente y periódica.
A.5.36|Cumplimiento de políticas y normas|Verificar y hacer cumplir políticas, reglas y estándares de seguridad.
A.5.37|Procedimientos operativos documentados|Documentar y controlar los procedimientos necesarios para operar.
A.6.1|Selección de personal|Verificar antecedentes y requisitos antes de contratar, conforme a la ley.
A.6.2|Términos y condiciones de empleo|Incluir responsabilidades de seguridad en el contrato laboral.
A.6.3|Concienciación, educación y formación|Formar periódicamente y medir la concienciación con casos reales.
A.6.4|Proceso disciplinario|Aplicar un proceso formal, proporcional y basado en evidencia.
A.6.5|Responsabilidades tras el cese o cambio de empleo|Mantener obligaciones y revocar accesos al terminar la relación.
A.6.6|Acuerdos de confidencialidad|Firmar y revisar NDA con empleados y terceros.
A.6.7|Trabajo remoto|Proteger la información fuera de las instalaciones y en dispositivos remotos.
A.6.8|Reporte de eventos de seguridad|Facilitar el reporte temprano y reconocer a quien informa.
A.7.1|Perímetros de seguridad física|Definir y proteger perímetros físicos frente a accesos no autorizados.
A.7.2|Entrada física|Controlar entradas, visitantes y registro de accesos físicos.
A.7.3|Seguridad de oficinas, salas e instalaciones|Diseñar y proteger los espacios que albergan información crítica.
A.7.4|Monitoreo de seguridad física|Vigilar y registrar accesos y actividades en áreas sensibles.
A.7.5|Protección contra amenazas físicas y ambientales|Proteger contra fuego, agua, clima, vandalismo y otras amenazas.
A.7.6|Trabajo en áreas seguras|Definir reglas para el trabajo en zonas de acceso restringido.
A.7.7|Escritorio y pantalla limpios|Aplicar limpieza y bloqueo para evitar exposición de información.
A.7.8|Ubicación y protección de equipos|Ubicar y proteger equipos para reducir riesgos físicos y ambientales.
A.7.9|Seguridad de activos fuera de las instalaciones|Proteger equipos, medios e información fuera de la sede.
A.7.10|Soportes de almacenamiento|Gestionar medios de almacenamiento, su uso, transporte y destrucción.
A.7.11|Servicios de suministro|Asegurar energía, climatización y comunicaciones críticas.
A.7.12|Seguridad del cableado|Proteger el cableado de energía y datos contra daño e interceptación.
A.7.13|Mantenimiento de equipos|Mantener equipos y soporte técnico de forma planificada.
A.7.14|Disposición o reutilización segura de equipos|Borrar datos y verificar antes de desechar o reutilizar equipos.
A.8.1|Dispositivos de usuario final|Proteger endpoints, su configuración, software y datos.
A.8.2|Derechos de acceso privilegiado|Restringir, revisar y controlar cuentas con privilegios elevados.
A.8.3|Restricción de acceso a la información|Limitar el acceso a información y funciones según la política.
A.8.4|Acceso al código fuente|Controlar el acceso y los cambios en repositorios de código.
A.8.5|Autenticación segura|Aplicar autenticación robusta, incluida MFA donde proceda.
A.8.6|Gestión de capacidad|Monitorear y planificar capacidad para mantener el servicio.
A.8.7|Protección contra malware|Prevenir, detectar y responder a software malicioso.
A.8.8|Gestión de vulnerabilidades técnicas|Identificar, priorizar y remediar vulnerabilidades con plazos.
A.8.9|Gestión de la configuración|Establecer, documentar y controlar configuraciones seguras.
A.8.10|Eliminación de información|Borrar información de forma segura cuando ya no se necesita.
A.8.11|Enmascaramiento de datos|Minimizar la exposición de datos sensibles mediante técnicas de ocultación.
A.8.12|Prevención de fuga de datos|Detectar y bloquear exfiltraciones de información sensible.
A.8.13|Copias de seguridad|Respaldar información y probar periódicamente la restauración.
A.8.14|Redundancia de instalaciones de procesamiento|Redundar componentes e instalaciones críticas.
A.8.15|Registro de eventos|Generar, proteger y revisar logs con retención adecuada.
A.8.16|Actividades de monitoreo|Detectar comportamientos anómalos y responder a alertas.
A.8.17|Sincronización de relojes|Usar fuentes de tiempo confiables y sincronizadas.
A.8.18|Uso de programas utilitarios privilegiados|Controlar herramientas que pueden eludir controles de seguridad.
A.8.19|Instalación de software en sistemas operativos|Restringir y controlar la instalación de software.
A.8.20|Seguridad de redes|Proteger, segmentar y monitorear las redes.
A.8.21|Seguridad de los servicios de red|Definir, implementar y monitorear servicios de red seguros.
A.8.22|Segregación de redes|Separar redes y servicios críticos según confianza y función.
A.8.23|Filtrado web|Bloquear contenido malicioso y accesos de riesgo.
A.8.24|Uso de criptografía|Definir política criptográfica y gestionar claves.
A.8.25|Ciclo de vida de desarrollo seguro|Integrar seguridad en todas las fases del desarrollo.
A.8.26|Requisitos de seguridad de aplicaciones|Definir requisitos de seguridad y controles de aceptación.
A.8.27|Principios de arquitectura de sistemas seguros|Diseñar con defensa en profundidad y mínimo privilegio.
A.8.28|Codificación segura|Aplicar prácticas de codificación que eviten vulnerabilidades.
A.8.29|Pruebas de seguridad en desarrollo y aceptación|Probar la seguridad antes de desplegar y aceptar sistemas.
A.8.30|Desarrollo externalizado|Supervisar y exigir seguridad al desarrollo de terceros.
A.8.31|Separación de entornos de desarrollo, prueba y producción|Separar entornos para evitar cambios y datos no controlados.
A.8.32|Gestión de cambios|Evaluar, aprobar, probar y registrar cambios.
A.8.33|Información de prueba|Proteger datos usados en pruebas y evitar datos reales innecesarios.
A.8.34|Protección de sistemas durante pruebas de auditoría|Proteger sistemas y datos durante pruebas de auditoría.
`;
const CONTROLS = {};
CONTROL_RAW.trim().split('\n').map(l => l.split('|')).forEach(([id, name, desc]) => {
  CONTROLS[id] = { id, name, desc, theme: id.slice(0, 3) };
});
const THEMES = {
  'A.5': { name: 'Organizacionales', count: 37, icon: '🏛️', desc: 'Gobierno, políticas, riesgos, proveedores, incidentes, continuidad y cumplimiento.' },
  'A.6': { name: 'Personas', count: 8, icon: '👥', desc: 'Selección, contratación, formación, disciplina, cese, confidencialidad y teletrabajo.' },
  'A.7': { name: 'Físicos', count: 14, icon: '🏢', desc: 'Perímetros, accesos, equipos, medios, suministros y eliminación segura.' },
  'A.8': { name: 'Tecnológicos', count: 34, icon: '💻', desc: 'Endpoints, accesos, redes, vulnerabilidades, respaldos, logs y desarrollo seguro.' }
};
