/* ===== PERFILES LEGALES =====
   Cada decisión incorrecta activa un expediente con consecuencias reales
   asociadas al RGPD, NIS2, la ley local, la certificación y la responsabilidad del CISO. */
const LEGAL = {
  privacy: {
    label: "Datos personales · categoría especial",
    items: [
      { t: "RGPD (UE) 2016/679 · arts. 32–34", d: "Multas de hasta 20 M€ o el 4 % de la facturación global anual, lo que sea mayor. Brechas notificables en 72 h." },
      { t: "Ley local de protección de datos", d: "Sanciones administrativas, reclamaciones de pacientes y obligación de indemnizar los daños causados." },
      { t: "NIS2 (UE) 2022/2555", d: "Entidad esencial del sector salud: hasta 10 M€ o el 2 % del volumen global, además de obligaciones de gestión de riesgo y reporte." },
      { t: "Certificación ISO/IEC 27001", d: "Suspensión o retirada del certificado; pérdida de contratos hospitalarios que exigen garantías formales." },
      { t: "Responsabilidad del CISO", d: "Exposición civil y, según jurisdicción, penal por negligencia grave en la protección de datos de pacientes." }
    ]
  },
  supply: {
    label: "Cadena de suministro · encargado de tratamiento",
    items: [
      { t: "RGPD · arts. 28 y 32", d: "Falta de contrato de encargado (DPA) y de garantías equivalentes: infracción directa del responsable, Vitalis Nova." },
      { t: "NIS2 · riesgo de cadena", d: "La entidad esencial debe evaluar y gestionar riesgos de proveedores; hasta 10 M€ o el 2 % del volumen global." },
      { t: "Incumplimiento contractual", d: "Penalizaciones del hospital cliente, pérdida de la licitación y obligación de indemnizar daños." },
      { t: "Certificación ISO/IEC 27001", d: "No conformidad en A.5.19–A.5.23; el certificado no cubre el riesgo real de la cadena." },
      { t: "Responsabilidad del CISO", d: "Se le puede reprochar no haber verificado accesos, subprocesadores ni ubicación de los datos." }
    ]
  },
  access: {
    label: "Acceso privilegiado · insider risk",
    items: [
      { t: "RGPD · arts. 5 y 32", d: "Acceso no autorizado a datos de salud: posible brecha y multa de hasta 20 M€ o el 4 % global." },
      { t: "Ley local y reclamaciones", d: "Pacientes afectados pueden reclamar daños; la organización responde por sus empleados y contratistas." },
      { t: "NIS2 · gestión de accesos", d: "Fallo de control de acceso en entidad esencial: hasta 10 M€ o el 2 % del volumen global." },
      { t: "Certificación ISO/IEC 27001", d: "No conformidad en A.5.18 y A.8.2; revisión de accesos y segregación de funciones quedan en evidencia." },
      { t: "Responsabilidad del CISO", d: "No demostrar revocación oportuna ni trazabilidad agrava la posición civil y penal." }
    ]
  },
  continuity: {
    label: "Continuidad · servicio crítico de salud",
    items: [
      { t: "NIS2 · continuidad y reporte", d: "Entidad esencial: hasta 10 M€ o el 2 % del volumen global por no garantizar la continuidad del servicio." },
      { t: "Contratos y nivel de servicio", d: "Penalizaciones, reclamaciones del hospital y pérdida de confianza; la indisponibilidad clínica tiene impacto directo en pacientes." },
      { t: "Certificación ISO/IEC 27001", d: "No conformidad en A.5.29, A.5.30 y A.8.13; los planes no probados son una debilidad frecuente." },
      { t: "Responsabilidad del CISO", d: "La ausencia de copias aisladas y pruebas de restauración puede considerarse negligencia grave." },
      { t: "Impacto reputacional", d: "Cobertura mediática, pérdida de clientes y cuestionamiento del liderazgo de seguridad." }
    ]
  },
  governance: {
    label: "Gobierno · decisión de la dirección",
    items: [
      { t: "Incumplimiento contractual", d: "El hospital cliente puede resolver el contrato y reclamar daños por prometer una certificación sin base." },
      { t: "Certificación ISO/IEC 27001", d: "Alcance no definido y evidencia no aplicable: la auditoría no puede demostrar conformidad." },
      { t: "Responsabilidad civil de la dirección", d: "La dirección conserva el deber de diligencia; no puede delegar el liderazgo del SGSI en un proveedor." },
      { t: "Responsabilidad del CISO", d: "Firmar una promesa que el sistema no sostiene compromete su credibilidad profesional y su posición legal." },
      { t: "Impacto reputacional y comercial", d: "Una certificación fallida o retirada es una señal de riesgo para clientes, inversores y reguladores." }
    ]
  },
  people: {
    label: "Personas · relación laboral y disciplina",
    items: [
      { t: "Ley laboral local", d: "Sanción o despido sin formación, investigación ni procedimiento puede ser declarado improcedente o nulo." },
      { t: "RGPD · datos del empleado", d: "La investigación debe respetar privacidad y proporcionalidad; las pruebas mal obtenidas no son utilizables." },
      { t: "Certificación ISO/IEC 27001", d: "A.6.3 y A.6.4 exigen concienciación previa y proceso disciplinario formal y proporcionado." },
      { t: "Responsabilidad civil", d: "La organización puede responder por daños si actúa sin debido proceso o expone datos del trabajador." },
      { t: "Cultura de seguridad", d: "El castigo sin formación destruye el reporte temprano de incidentes y aumenta el riesgo oculto." }
    ]
  },
  audit: {
    label: "Auditoría · integridad de la certificación",
    items: [
      { t: "Organismo de certificación", d: "Declaración falsa u ocultación de no conformidades: retirada o suspensión del certificado y auditoría extraordinaria." },
      { t: "Fraude y responsabilidad legal", d: "La dirección y el CISO pueden enfrentar acciones civiles y, según jurisdicción, penales por manifestaciones engañosas." },
      { t: "Contratos y clientes", d: "Pérdida de licitaciones, resolución de contratos y reclamaciones por incumplimiento de garantías." },
      { t: "ISO/IEC 27001 · cláusulas 9 y 10", d: "No se cumple la evaluación del desempeño ni la mejora; las no conformidades siguen abiertas y se repetirán." },
      { t: "Reputación", d: "El valor de la certificación depende de su credibilidad; un escándalo de auditoría destruye la confianza." }
    ]
  }
};

/* ===== ESCENARIOS =====
   10 situaciones, 3–4 opciones cada una. Cada opción apunta a un control del Anexo A,
   una cláusula del SGSI o un concepto del DOI. options[].verdict:
   optimal (+100), acceptable (+65, sin alarma) o wrong (alarma + bifurcación legal). */
const SCENARIOS = [
  {
    act: "ACTO I · GOBIERNO Y CONTEXTO",
    title: "El primer día",
    place: "Sede de Vitalis Nova · 08:40",
    objective: "Arrancar el SGSI sin vender humo.",
    brief: "Vitalis Nova, una health-tech de 180 personas, acaba de fichar a Juan como CISO. Su primer correo es del CEO: «Un hospital europeo nos exige ISO 27001 en 90 días. Necesito un plan para el lunes». Sobre la mesa hay tres carpetas: una propuesta de consultoría, un SGSI copiado de otra empresa y un inventario de activos sin actualizar desde 2022. Juan respira. Lo que decida ahora definirá el alcance de todo lo demás.",
    focus: ["Cláusula 4.1–4.3", "A.5.9", "DOI"],
    sources: [24, 8, 5],
    options: [
      {
        t: "Definir contexto, alcance y activos críticos antes de prometer fechas", d: "Mapea procesos clínicos, partes interesadas y límites del SGSI; actualiza el inventario y prioriza por criticidad.", ref: "Cláusulas 4.1–4.3 · A.5.9", ctl: "A.5.9", verdict: "optimal",
        fb: "El alcance es la primera decisión de arquitectura del SGSI. Sin contexto ni inventario no hay riesgos comparables ni auditoría defendible: la cláusula 4.3 exige límites documentados y A.5.9 saber qué activos importan y quién los posee. Un alcance acotado permite madurar por fases y obtener valor antes de certificar."
      },
      {
        t: "Contratar un consultor para que entregue el SGSI llave en mano", d: "Apoyo externo con metodología probada, contrato por hitos y transferencia de conocimiento obligatoria.", ref: "Cláusula 5.1 · A.5.2", ctl: "A.5.2", verdict: "acceptable",
        fb: "El apoyo externo es legítimo y acelera, pero el SGSI no se delega: la dirección conserva la responsabilidad (cláusula 5.1) y el equipo debe poder mantenerlo. Sin transferencia de conocimiento, el sistema queda dependiente del consultor y pierde capacidad de mejora."
      },
      {
        t: "Aceptar los 90 días y reservar ya la auditoría de certificación", d: "Firma el contrato con el hospital y bloquea la fecha externa antes de definir alcance, riesgos o evidencias.", ref: "Cláusula 4.3 · Cláusula 6.1.2", ctl: "A.5.9", verdict: "wrong",
        why: "Se compromete una certificación sin alcance, análisis de riesgo ni evidencias. El auditor no puede verificar un sistema que aún no existe y el cliente recibe una promesa que la organización no puede sostener.",
        legal: "governance", legalFocus: "Compromiso contractual con un hospital europeo sin capacidad demostrada de cumplimiento.",
        fix: ["Se prometió una fecha de certificación antes de definir alcance, activos y riesgos.", "Documentar alcance, inventario y análisis de riesgos; replanificar el hito con la dirección.", "Juan Pérez · CISO", "2026-12-18"],
        fb: "La cláusula 6.1 exige planificar riesgos y la 9.2 auditar con evidencia; una fecha no sustituye un sistema. El camino correcto era acotar alcance y madurar por fases."
      },
      {
        t: "Copiar el SGSI de otra empresa del sector y cambiar el logo", d: "Descarga políticas, matrices y procedimientos; ajusta nombres y presenta el paquete.", ref: "A.5.1 · Cláusula 4.1", ctl: "A.5.1", verdict: "wrong",
        why: "Las políticas ajenas no reflejan los activos, procesos ni riesgos de Vitalis Nova. El auditor detecta la falta de aplicabilidad y el personal no reconoce sus obligaciones.",
        legal: "governance", legalFocus: "Documentación no propia y no aplicable: evidencia inválida ante cliente y auditor.",
        fix: ["Se reutilizó documentación de otra organización sin analizar el contexto propio.", "Reescribir políticas y análisis de riesgo desde el contexto de Vitalis Nova.", "Juan Pérez · CISO", "2026-12-20"],
        fb: "A.5.1 exige políticas propias, aprobadas y revisadas; copiar rompe la trazabilidad con el contexto (4.1) y con el DOI. La evidencia debe ser pertinente, no solo abundante."
      }
    ]
  },
  {
    act: "ACTO I · GOBIERNO Y CONTEXTO",
    title: "La política que nadie leyó",
    place: "Comité de seguridad · 10:15",
    objective: "Convertir una política en conducta real.",
    brief: "La política de seguridad lleva seis meses en la intranet. Solo el 12 % la ha abierto. En el pasillo, una analista presume de compartir su contraseña con el equipo «para no perder tiempo». El comité pide resultados y Juan descubre que los roles de seguridad nunca se formalizaron.",
    focus: ["Cláusula 5.1–5.3", "A.5.1", "A.6.3"],
    sources: [5, 26, 9],
    options: [
      {
        t: "Co-crear con la dirección una política breve, aprobarla y asignar roles", d: "Sesiones de 30 minutos por equipo, ejemplos del sector salud, roles con nombre y apellido y una campaña de contraseñas.", ref: "Cláusulas 5.1–5.3 · A.5.1, A.5.2, A.6.3", ctl: "A.5.1", verdict: "optimal",
        fb: "La política solo cambia conductas si la dirección la patrocina y cada rol entiende su parte. Cláusula 5.1 exige liderazgo; A.5.1, política aprobada; A.5.2, roles; A.6.3, formación continua. La seguridad es gestión y personas, no un PDF."
      },
      {
        t: "Publicar la política y exigir firma de recepción", d: "Campaña de acuse de recibo y recordatorio trimestral.", ref: "A.5.1 · A.6.3", ctl: "A.5.1", verdict: "acceptable",
        fb: "Cumple la evidencia documental mínima, pero la firma no demuestra comprensión. A.6.3 pide concienciación medible y A.5.4 que la dirección exija cumplimiento; sin casos prácticos, el hábito no cambia."
      },
      {
        t: "Dejar que el proveedor de TI escriba la política y los roles", d: "El proveedor redacta el documento y define quién es responsable de qué.", ref: "Cláusula 5.1 · A.5.2", ctl: "A.5.2", verdict: "wrong",
        why: "La dirección no puede externalizar el liderazgo ni la asignación de responsabilidades. El proveedor no conoce los procesos clínicos ni puede aceptar riesgos en nombre de Vitalis Nova.",
        legal: "governance", legalFocus: "La dirección conserva la responsabilidad legal; no puede delegar el liderazgo del SGSI.",
        fix: ["La dirección delegó la política y los roles en un proveedor externo.", "Reasumir liderazgo: aprobar política, asignar roles y exigir rendición de cuentas.", "Dirección General + CISO", "2026-12-15"],
        fb: "Cláusula 5.1 y A.5.2 sitúan la responsabilidad en la organización. El proveedor puede asesorar, no gobernar. Sin dueños internos, ningún control se sostiene."
      },
      {
        t: "Sancionar a la analista que compartió la contraseña sin investigar ni formar", d: "Abrir expediente disciplinario ejemplarizante para enviar un mensaje.", ref: "A.6.4 · A.6.3", ctl: "A.6.4", verdict: "wrong",
        why: "Se sanciona una conducta que la organización nunca formó ni prohibió con claridad. Además, no se investiga si hubo acceso no autorizado ni se preserva evidencia.",
        legal: "people", legalFocus: "Sanción laboral sin formación ni procedimiento: riesgo de reclamación por despido improcedente.",
        fix: ["Se sancionó sin formación previa ni investigación de los hechos.", "Retirar la sanción, formar, investigar y aplicar el proceso disciplinario con evidencia.", "RRHH + CISO", "2026-12-22"],
        fb: "A.6.4 exige un proceso disciplinario formal, proporcional y con evidencia; A.6.3, formación previa. Sancionar sin causa ni investigación no corrige el riesgo y puede vulnerar derechos laborales."
      }
    ]
  },
  {
    act: "ACTO I · GOBIERNO Y CONTEXTO",
    title: "El riesgo que no cupo en el Excel",
    place: "Sala de riesgos · 12:30",
    objective: "Elegir un método de riesgo defendible.",
    brief: "El comité de riesgos pide una lista de riesgos para el lunes. El equipo de TI entrega un escaneo con 412 vulnerabilidades. Nadie ha evaluado qué datos clínicos son críticos, qué pasaría si se pierden ni quién acepta el riesgo residual. El CEO sugiere «empezar por lo técnico y luego vemos».",
    focus: ["Cláusula 6.1.2–6.1.3", "A.5.7", "ISO 27005"],
    sources: [38, 41, 3],
    options: [
      {
        t: "Aplicar ISO 27005 + NIST 800-30 con criterios de probabilidad e impacto", d: "Identifica activos, amenazas y vulnerabilidades; evalúa C/I/A, define dueños y prioriza el tratamiento.", ref: "Cláusulas 6.1.2–6.1.3 · A.5.7", ctl: "A.5.7", verdict: "optimal",
        fb: "El riesgo se evalúa contra el negocio, no solo contra el escáner. Cláusula 6.1.2 exige criterios; 6.1.3, tratamiento y aceptación; ISO 27005 y NIST 800-30 aportan método. Sin dueño y criterio, no hay prioridad defendible."
      },
      {
        t: "Registro de riesgos en Excel con criterios y revisión trimestral", d: "Matriz probabilidad-impacto, dueños y comité de riesgos.", ref: "Cláusulas 6.1.2–6.1.3", ctl: "A.5.9", verdict: "acceptable",
        fb: "Es un avance válido si los criterios están definidos y hay revisión. La debilidad es la trazabilidad manual y el riesgo de desactualización; conviene evolucionar a una herramienta con evidencia y alertas."
      },
      {
        t: "Comprar un escáner y tratar solo las vulnerabilidades técnicas", d: "Prioriza CVSS, parchea lo alto y considera el riesgo cubierto.", ref: "A.8.8 · Cláusula 6.1.2", ctl: "A.8.8", verdict: "wrong",
        why: "El escáner no ve riesgos de personas, proveedores, procesos ni datos. Se confunde vulnerabilidad técnica con riesgo de negocio y se ignoran controles organizacionales.",
        legal: "privacy", legalFocus: "Riesgos de datos de pacientes no identificados: exposición inconsciente ante una brecha.",
        fix: ["El riesgo se redujo a vulnerabilidades técnicas sin criterios de negocio.", "Completar análisis C/I/A con ISO 27005 y NIST 800-30; registrar riesgos y dueños.", "Juan Pérez · CISO", "2026-12-19"],
        fb: "Cláusula 6.1.2 pide evaluar el riesgo desde el contexto; A.8.8 solo cubre vulnerabilidades técnicas. La seguridad es un problema de gestión, no solo de herramientas."
      },
      {
        t: "Aceptar todos los riesgos: la empresa es pequeña y no es un banco", d: "Se archiva el escaneo y se sigue operando.", ref: "Cláusula 6.1.3 · Cláusula 6.2", ctl: "A.5.9", verdict: "wrong",
        why: "No existe criterio de aceptación, aprobación formal ni propietario del riesgo. La dirección no puede demostrar diligencia y los riesgos de datos de pacientes quedan abiertos.",
        legal: "governance", legalFocus: "Aceptación informal de riesgos: la dirección no puede demostrar diligencia.",
        fix: ["Se aceptaron riesgos sin criterios formales ni aprobación.", "Definir criterios de aceptación, aprobar por dirección y tratar riesgos altos.", "Comité de riesgos", "2026-12-21"],
        fb: "La cláusula 6.1.3 exige decidir y documentar el tratamiento; la 6.2, objetivos medibles. Aceptar sin criterio no es una decisión de riesgo, es una omisión."
      }
    ]
  },
  {
    act: "ACTO II · PERSONAS Y CADENA DE SUMINISTRO",
    title: "El clic de las 2:13",
    place: "SOC · 02:21",
    objective: "Responder a un incidente sin destruir evidencia.",
    brief: "A las 2:13, un correo del «hospital asociado» pide validar una factura. Un analista introduce sus credenciales en una página clonada. A las 2:21, el SIEM detecta un inicio de sesión desde otro país con su cuenta. La cuenta no tiene MFA y pertenece al equipo de facturación clínica.",
    focus: ["A.5.24–5.28", "A.6.8", "A.8.16"],
    sources: [39, 50, 9],
    options: [
      {
        t: "Contener, preservar evidencia, evaluar alcance y activar el procedimiento", d: "Aísla la cuenta, protege logs, investiga, comunica según el plan y documenta lecciones aprendidas.", ref: "A.5.24–A.5.28 · A.6.8", ctl: "A.5.26", verdict: "optimal",
        fb: "Un incidente se gestiona con método: A.5.24 prepara, A.5.25 evalúa, A.5.26 responde, A.5.27 aprende y A.5.28 preserva evidencia. La contención rápida reduce el impacto; el registro permite notificar y mejorar."
      },
      {
        t: "Aislar el equipo y cambiar credenciales, sin registrar el incidente", d: "Se recupera el servicio rápido y se evita el papeleo.", ref: "A.5.26–A.5.27", ctl: "A.5.27", verdict: "acceptable",
        fb: "Contiene el acceso, pero no deja expediente ni evalúa si hubo exfiltración. A.5.27 y A.5.28 exigen aprender y preservar evidencia; sin registro, la próxima vez se repite el error."
      },
      {
        t: "Borrar los logs, resetear contraseñas y seguir como si nada", d: "Limpieza rápida para no alarmar al cliente.", ref: "A.5.28 · A.8.15", ctl: "A.5.28", verdict: "wrong",
        why: "Destruir logs elimina la posibilidad de saber qué datos se vieron o exfiltraron. Impide notificar una brecha y obstruye cualquier investigación.",
        legal: "privacy", legalFocus: "Destrucción de evidencia de un incidente con posibles datos personales: obstrucción e imposibilidad de notificar.",
        fix: ["Se priorizó limpiar el incidente antes de preservar evidencia y aprender.", "Restaurar logs, abrir expediente, preservar cadena de custodia y notificar según procedimiento.", "CISO + SOC", "2026-12-16"],
        fb: "A.5.28 exige preservar evidencia con cadena de custodia y A.8.15 proteger los logs. Ocultar un incidente agrava la sanción y rompe la confianza."
      },
      {
        t: "Enviar un correo masivo pidiendo «estar atentos al phishing»", d: "Comunicación preventiva sin contener la cuenta comprometida.", ref: "A.6.3 · A.5.24", ctl: "A.6.3", verdict: "wrong",
        why: "La cuenta sigue activa y el incidente no se investiga. La concienciación no sustituye la respuesta técnica ni la evaluación del alcance.",
        legal: "privacy", legalFocus: "Incidente no registrado: se incumple el reporte y se agrava la brecha.",
        fix: ["Se confundió concienciación con respuesta a incidentes.", "Activar el plan A.5.24–A.5.26, contener, investigar y registrar el incidente.", "CISO + SOC", "2026-12-15"],
        fb: "A.6.3 ayuda a prevenir, pero A.5.24–A.5.26 exige responder. Primero se contiene y se investiga; después se comunica y se forma."
      }
    ]
  },
  {
    act: "ACTO II · PERSONAS Y CADENA DE SUMINISTRO",
    title: "La nube con llave maestra",
    place: "Sala de proveedores · 09:20",
    objective: "Gobernar un proveedor crítico de datos clínicos.",
    brief: "El proveedor de imagen médica en la nube es el corazón del servicio. Juan descubre que cuatro personas comparten una cuenta de administrador, que no hay DPA firmado y que los datos se replican en una región fuera de la UE. El contrato se renueva en 20 días.",
    focus: ["A.5.19–5.23", "A.5.34", "NIS2"],
    sources: [1, 4, 57],
    options: [
      {
        t: "Due diligence, DPA, MFA, monitoreo y plan de salida antes de renovar", d: "Evalúa madurez, exige trazabilidad, define métricas y garantiza recuperar los datos si el proveedor falla.", ref: "A.5.19–A.5.23 · A.5.34", ctl: "A.5.23", verdict: "optimal",
        fb: "El proveedor forma parte de tu superficie de riesgo. A.5.19–A.5.23 exigen due diligence, cláusulas, monitoreo y control del servicio; A.5.34, protección de datos. Elegir madurez previa es más eficaz que imponer requisitos después."
      },
      {
        t: "Cuestionario de seguridad anual y certificado ISO del proveedor", d: "Se revisa una vez al año y se archiva la evidencia contractual.", ref: "A.5.19 · A.5.22", ctl: "A.5.22", verdict: "acceptable",
        fb: "Es evidencia útil, pero puntual. A.5.22 pide monitoreo continuo y A.5.23 controlar configuración, subprocesadores y salida. El certificado no cubre tu configuración ni tus datos."
      },
      {
        t: "Confiar: es un proveedor grande y «de confianza»", d: "No se revisan contratos, accesos ni ubicación de los datos.", ref: "A.5.19 · A.5.21", ctl: "A.5.19", verdict: "wrong",
        why: "El riesgo del proveedor se transfiere a Vitalis Nova: su incidente es tu incidente. Sin DPA ni control de accesos, la brecha se produce en tu cadena de suministro.",
        legal: "supply", legalFocus: "Datos de pacientes en un proveedor sin DPA ni control: brecha en la cadena de suministro.",
        fix: ["Se asumió que un proveedor grande transfiere el riesgo automáticamente.", "Due diligence, DPA, MFA, monitoreo y plan de salida documentados.", "CISO + Compras", "2026-12-12"],
        fb: "A.5.19 y A.5.21 exigen gestionar el riesgo de la cadena; A.5.34, proteger datos personales. La confianza no es un control."
      },
      {
        t: "Exigir el certificado ISO del proveedor y dar el riesgo por cerrado", d: "Se archiva el certificado y no se revisan accesos ni subprocesadores.", ref: "A.5.22–A.5.23", ctl: "A.5.23", verdict: "wrong",
        why: "El certificado acredita el SGSI del proveedor en un alcance y fecha, no tu configuración, tus datos ni sus subcontratistas. Además, exigir assurance puede provocar esfuerzo aparente si el proveedor reacciona tarde.",
        legal: "supply", legalFocus: "Certificado ajeno no cubre la configuración real ni los subprocesadores.",
        fix: ["Se tomó el certificado del proveedor como prueba de nuestro control.", "Verificar alcance, configuración, subprocesadores y evidencias; monitorizar.", "CISO + Compras", "2026-12-17"],
        fb: "A.5.22 exige monitoreo y revisión; A.5.23, controlar el servicio en la nube. La evidencia contractual debe verificarse y renovarse."
      }
    ]
  },
  {
    act: "ACTO II · PERSONAS Y CADENA DE SUMINISTRO",
    title: "La huella del administrador",
    place: "TI y RRHH · 17:45",
    objective: "Cerrar el acceso privilegiado sin dejar puertas abiertas.",
    brief: "El administrador de la plataforma clínica presenta su renuncia. Su último día es el viernes. Conserva acceso de producción, un token VPN y la contraseña del gestor de secretos compartido. Además, su tarjeta de contratista abre la sala de servidores. Recursos Humanos pide a Juan «que le desactive la cuenta el viernes a las 18:00».",
    focus: ["A.5.11, A.5.18", "A.6.5, A.8.2"],
    sources: [2, 9, 45],
    options: [
      {
        t: "Offboarding coordinado: revocar accesos y sesiones, rotar secretos y recuperar activos", d: "Checklist con RRHH, TI y seguridad; revisión de privilegios y evidencia documentada.", ref: "A.5.11 · A.5.18 · A.6.5 · A.8.2", ctl: "A.8.2", verdict: "optimal",
        fb: "El offboarding es un control, no un trámite. A.5.11 recupera activos, A.5.18 revoca derechos, A.6.5 mantiene responsabilidades y A.8.2 controla privilegios. La rotación de secretos evita puertas traseras."
      },
      {
        t: "Checklist de salida con RRHH y TI, ejecutado el último día", d: "Se desactiva la cuenta y se recogen equipos al finalizar la jornada.", ref: "A.6.5 · A.5.18", ctl: "A.5.18", verdict: "acceptable",
        fb: "Mejor que la improvisación, pero el último día deja una ventana de acceso. A.5.18 pide revocación oportuna; conviene iniciar el cierre el mismo día de la comunicación y verificar sesiones."
      },
      {
        t: "Desactivar la cuenta el viernes y cambiar la contraseña compartida", d: "Se cambia la clave del gestor y se avisa por correo.", ref: "A.5.18 · A.8.2", ctl: "A.5.18", verdict: "wrong",
        why: "El token VPN, las sesiones activas y los secretos que conoce siguen vigentes. La contraseña compartida no permite saber quién accedió ni revocar un acceso individual.",
        legal: "access", legalFocus: "Acceso privilegiado persistente tras el cese: riesgo de sabotaje y exfiltración.",
        fix: ["El acceso privilegiado se compartía y el cierre dependía de una contraseña.", "Eliminar credenciales compartidas, rotar secretos, revocar sesiones y revisar privilegios.", "CISO + Infraestructura", "2026-12-14"],
        fb: "A.8.2 exige controlar privilegios y A.5.18 revocar derechos; las credenciales compartidas impiden trazabilidad. La seguridad de accesos se diseña, no se improvisa."
      },
      {
        t: "Confiar en que el jefe directo avise a TI cuando se vaya", d: "Sin checklist, sin plazo y sin responsable formal.", ref: "A.6.5 · A.5.2", ctl: "A.6.5", verdict: "wrong",
        why: "No hay proceso, plazo ni evidencia. Si el aviso falla, el acceso permanece y nadie lo detecta.",
        legal: "access", legalFocus: "Revocación tardía: ventana de acceso no autorizado sin trazabilidad.",
        fix: ["No existía un proceso formal de salida coordinado entre RRHH y TI.", "Formalizar offboarding con checklist, plazos y verificación de accesos.", "RRHH + CISO", "2026-12-18"],
        fb: "A.6.5 y A.5.2 exigen responsabilidades claras; A.5.18, revocación documentada. Depender de un correo informal no es un control."
      }
    ]
  },
  {
    act: "ACTO III · OPERACIÓN Y TECNOLOGÍA",
    title: "Ransomware a las 03:00",
    place: "Centro de operaciones · 03:07",
    objective: "Recuperar el servicio clínico sin reinfectar la red.",
    brief: "Domingo, 03:00. El portal de resultados clínicos muestra una nota de rescate. Los backups existen, pero el servidor de respaldo está en el mismo dominio y también fue cifrado. El director médico pregunta cuánto tardará en volver. El atacante pide 180.000 € en criptomonedas.",
    focus: ["A.5.29–5.30", "A.8.13–8.14", "NIS2"],
    sources: [50, 6, 4],
    options: [
      {
        t: "Activar continuidad, aislar y restaurar una copia inmutable probada", d: "Contiene, investiga el origen, restaura en entorno limpio y comunica a dirección y autoridades.", ref: "A.5.29–A.5.30 · A.8.13–A.8.14", ctl: "A.5.30", verdict: "optimal",
        fb: "La continuidad se prueba antes del desastre. A.5.29 mantiene seguridad durante la interrupción, A.5.30 prepara la continuidad TIC, A.8.13 exige backups probados y A.8.14 redundancia. Restaurar desde una copia aislada evita la reinfección."
      },
      {
        t: "Restaurar el último backup y volver a operar; documentar después", d: "Se prioriza recuperar el servicio cuanto antes.", ref: "A.8.13 · A.5.30", ctl: "A.8.13", verdict: "acceptable",
        fb: "Recupera el servicio, pero si la copia no se valida ni se aísla, puede reintroducir el malware. A.8.13 exige probar la restauración y A.5.30 documentar y revisar el plan."
      },
      {
        t: "Pagar el rescate para recuperar en horas", d: "Se contacta al atacante y se transfiere el dinero.", ref: "A.5.29 · A.8.13", ctl: "A.8.13", verdict: "wrong",
        why: "Pagar financia actividad criminal, no garantiza la recuperación y puede exponer a sanciones. Además, no corrige el acceso inicial ni la falta de backups aislados.",
        legal: "continuity", legalFocus: "Pago a ciberdelincuentes y posible financiación de actividades ilícitas; no garantiza recuperación.",
        fix: ["La presión operativa llevó a pagar sin evaluar alternativas ni legalidad.", "Activar continuidad, restaurar copia inmutable, forensicar y reportar a autoridades.", "Dirección + CISO + Legal", "2026-12-13"],
        fb: "ISO 27001 no prohíbe negociar, pero exige continuidad y recuperación planificada (A.5.30, A.8.13). La decisión debe coordinarse con dirección, legal y autoridades."
      },
      {
        t: "Reconectar el backup a la red y restaurar sin analizar el origen", d: "Se prioriza velocidad sobre contención.", ref: "A.8.13–A.8.14 · A.5.30", ctl: "A.8.14", verdict: "wrong",
        why: "La copia puede estar contaminada o el atacante conservar persistencia. Restaurar sin forense puede reinfectar y ampliar la pérdida de datos clínicos.",
        legal: "continuity", legalFocus: "Reinfección y pérdida de datos clínicos; continuidad no probada.",
        fix: ["Se restauró sin validar la integridad ni el origen del backup.", "Aislar, analizar muestras, restaurar en entorno limpio y probar antes de reconectar.", "Infraestructura + SOC", "2026-12-13"],
        fb: "A.8.13 exige verificar la integridad de las copias y A.5.30 probar la recuperación. Contener y analizar antes de restaurar es parte del control."
      }
    ]
  },
  {
    act: "ACTO III · OPERACIÓN Y TECNOLOGÍA",
    title: "El parche del viernes",
    place: "Comité técnico · 11:10",
    objective: "Remediar una vulnerabilidad crítica sin tumbar el quirófano.",
    brief: "El proveedor del portal clínico publica un parche para una vulnerabilidad crítica (CVSS 9,8) que ya se explota. El cambio debe pasar por producción, pero el comité técnico recuerda que el viernes hay quirófanos programados y que el último despliegue sin pruebas tumbó el servicio dos horas.",
    focus: ["A.8.8, A.8.32", "A.8.31, A.8.9"],
    sources: [36, 51, 9],
    options: [
      {
        t: "Priorizar por riesgo, probar en preproducción y aplicar una ventana de emergencia", d: "Plan de cambio con rollback, verificación posterior y comunicación a negocio.", ref: "A.8.8 · A.8.32 · A.8.31 · A.8.9", ctl: "A.8.8", verdict: "optimal",
        fb: "Gestionar vulnerabilidades es priorizar y controlar el cambio. A.8.8 exige plazos según riesgo; A.8.32, evaluar y probar cambios; A.8.31, separar entornos; A.8.9, configuración conocida. La prisa sin control también es un riesgo."
      },
      {
        t: "Mitigar con WAF y reglas temporales; parchear en la próxima ventana", d: "Se documenta la mitigación, se monitoriza y se fija fecha de caducidad.", ref: "A.8.8 · A.8.20", ctl: "A.8.8", verdict: "acceptable",
        fb: "Una mitigación compensatoria es válida si está documentada, monitorizada y tiene fecha de caducidad. A.8.8 no termina con el WAF: el parche sigue siendo necesario y debe verificarse."
      },
      {
        t: "Parchear toda la producción el viernes sin pruebas ni rollback", d: "Se aplica el parche a todos los servidores a la vez.", ref: "A.8.32 · A.8.31", ctl: "A.8.32", verdict: "wrong",
        why: "Un cambio no probado en un sistema clínico puede causar indisponibilidad, corrupción o pérdida de datos. Además, sin rollback se alarga la caída.",
        legal: "continuity", legalFocus: "Caída del portal clínico por cambio no probado: impacto directo en pacientes.",
        fix: ["Se priorizó la velocidad sobre el control de cambios y la continuidad clínica.", "Plan de cambio de emergencia, preproducción, rollback y comunicación.", "CISO + Infraestructura", "2026-12-15"],
        fb: "A.8.32 exige evaluar, aprobar, probar y registrar cambios; A.8.31 separar entornos. La seguridad incluye disponibilidad, no solo parchear."
      },
      {
        t: "Esperar al próximo trimestre: el portal «no es crítico»", d: "Se acepta el riesgo sin evaluación ni compensación.", ref: "A.8.8 · A.5.7", ctl: "A.8.8", verdict: "wrong",
        why: "Es una vulnerabilidad conocida, explotada y en un sistema con datos de pacientes. La aceptación no está documentada ni aprobada por el dueño del riesgo.",
        legal: "privacy", legalFocus: "Vulnerabilidad conocida y explotada sin remediar: negligencia documentada.",
        fix: ["Se subestimó una vulnerabilidad explotada por no ser crítica para el negocio.", "Priorizar por riesgo, aplicar mitigación temporal y parchear con seguimiento.", "CISO + SecOps", "2026-12-14"],
        fb: "A.8.8 exige priorizar por riesgo y A.5.7 usar inteligencia de amenazas. Ignorar una explotación activa es una decisión de riesgo no documentada."
      }
    ]
  },
  {
    act: "ACTO III · OPERACIÓN Y TECNOLOGÍA",
    title: "El dato que salió en un correo",
    place: "DLP y cumplimiento · 16:40",
    objective: "Gestionar una brecha de datos de salud.",
    brief: "El sistema DLP bloquea un correo con 4.200 registros de pacientes enviado desde facturación a un Gmail personal. El adjunto va sin cifrar. El empleado dice que era «para trabajar en casa». No hay registro de la brecha ni una evaluación de si los datos llegaron a abrirse. Son las 16:40 de un viernes.",
    focus: ["A.5.34, A.8.12", "A.5.24–5.26", "RGPD 72 h"],
    sources: [7, 4, 57],
    options: [
      {
        t: "Contener, preservar evidencia, evaluar el riesgo y notificar si procede", d: "Consulta legal, documenta la brecha y cumple el plazo de 72 h del RGPD cuando aplique.", ref: "A.5.34 · A.8.12 · A.5.24–A.5.26 · A.5.31", ctl: "A.5.34", verdict: "optimal",
        fb: "Una brecha de datos personales tiene reloj legal. A.5.34 exige privacidad; A.8.12, prevención de fuga; A.5.24–A.5.26, respuesta; A.5.31, cumplir obligaciones. La evaluación y la notificación se documentan, aunque no todos los casos acaben en comunicación pública."
      },
      {
        t: "Contener y abrir investigación; notificar solo si se confirma acceso", d: "Se analiza el alcance y se decide con asesoría legal.", ref: "A.5.34 · A.5.26", ctl: "A.5.26", verdict: "acceptable",
        fb: "Investigar es correcto, pero el plazo de 72 h del RGPD puede estar corriendo. La decisión de notificar debe tomarse con legal y documentarse; no se puede esperar indefinidamente."
      },
      {
        t: "Borrar el correo y pedir al empleado que no lo cuente", d: "Se elimina la evidencia y se evita el reporte.", ref: "A.5.34 · A.5.31 · A.5.28", ctl: "A.5.34", verdict: "wrong",
        why: "Ocultar una brecha de categoría especial es una infracción agravada. Se destruye evidencia, se impide la notificación y se expone a la organización a sanciones mucho mayores.",
        legal: "privacy", legalFocus: "Brecha de datos de categoría especial ocultada: agravante ante la autoridad.",
        fix: ["Se intentó ocultar una posible brecha para evitar consecuencias.", "Contener, preservar evidencia, evaluar riesgo y notificar a la autoridad en 72 h si procede.", "CISO + DPO + Legal", "2026-12-14"],
        fb: "A.5.34 y A.5.31 obligan a cumplir la ley; A.5.28, preservar evidencia. La transparencia y la corrección reducen el daño; el encubrimiento lo multiplica."
      },
      {
        t: "Despedir al empleado de inmediato sin investigar", d: "Sanción ejemplar para cerrar el tema.", ref: "A.6.4 · A.5.28", ctl: "A.6.4", verdict: "wrong",
        why: "Se actúa sin prueba ni debido proceso, se pierde evidencia y no se evalúa la brecha. La organización sigue sin saber qué datos salieron.",
        legal: "people", legalFocus: "Despido sin prueba: nulidad y pérdida de evidencia.",
        fix: ["Se aplicó disciplina sin investigación ni debido proceso.", "Reabrir investigación, preservar evidencia, formar y aplicar A.6.4 con proporcionalidad.", "RRHH + CISO + Legal", "2026-12-16"],
        fb: "A.6.4 exige proceso disciplinario con evidencia; A.5.28, preservar pruebas. Primero se investiga la brecha y se protege al paciente; después se decide la acción laboral."
      }
    ]
  },
  {
    act: "ACTO IV · MEJORA Y CERTIFICACIÓN",
    title: "La auditoría de las siete brechas",
    place: "Sala del consejo · 18:30",
    objective: "Decidir qué hacer con las no conformidades antes de certificar.",
    brief: "A dos semanas de la auditoría de certificación, la auditoría interna detecta siete no conformidades: dos mayores (revisión de accesos y restauración de backups) y cinco menores. El CEO reúne al comité: «Si las ocultamos, pasamos. Ya las arreglaremos después». Juan tiene la palabra.",
    focus: ["Cláusulas 9.2–9.3", "Cláusula 10.1–10.2", "A.5.35"],
    sources: [10, 47, 34],
    options: [
      {
        t: "Declarar las NC, analizar causa raíz, corregir y verificar eficacia", d: "Registro de no conformidades, acciones con responsable y fecha, revisión por dirección.", ref: "Cláusulas 9.2–9.3 · 10.1–10.2", ctl: "A.5.35", verdict: "optimal",
        fb: "La cláusula 10.2 exige reaccionar, evaluar la necesidad de acción, implementar, revisar eficacia y actualizar riesgos. La 9.2 aporta la auditoría interna y la 9.3 la revisión por dirección. Un SGSI maduro no esconde hallazgos: los convierte en mejora."
      },
      {
        t: "Corregir las dos mayores y documentar un plan a 90 días para las menores", d: "Se prioriza el riesgo y se mantiene un registro con seguimiento.", ref: "Cláusula 10.2 · Cláusula 9.2", ctl: "A.5.35", verdict: "acceptable",
        fb: "Es una respuesta proporcionada si hay causa raíz, responsables, plazos y verificación. Las menores no desaparecen: deben quedar en el registro y en la revisión por dirección."
      },
      {
        t: "Ocultar los hallazgos y presentar evidencias maquilladas", d: "Se prepara una carpeta «limpia» para el auditor.", ref: "Cláusulas 9.2, 10.2 · A.5.35", ctl: "A.5.35", verdict: "wrong",
        why: "Es una declaración falsa ante un organismo de certificación. Si se detecta, se retira el certificado y se compromete la reputación y los contratos. Además, las brechas siguen abiertas.",
        legal: "audit", legalFocus: "Declaración falsa ante organismo de certificación: fraude y retirada.",
        fix: ["La dirección priorizó la imagen ante el auditor sobre la mejora real.", "Declarar las NC, analizar causa raíz, corregir y verificar eficacia; informar al organismo.", "Dirección + CISO", "2026-12-19"],
        fb: "Cláusula 10.2 y A.5.35 exigen integridad y revisión independiente. La certificación es una señal de confianza: falsificarla destruye su valor."
      },
      {
        t: "Posponer la auditoría y no documentar nada", d: "Se gana tiempo y se evita el expediente.", ref: "Cláusulas 9.2, 10.2 · 9.3", ctl: "A.5.35", verdict: "wrong",
        why: "No se trata ninguna no conformidad y se incumple la evaluación del desempeño. El riesgo sigue abierto y la próxima auditoría encontrará lo mismo, agravado.",
        legal: "audit", legalFocus: "No conformidades no tratadas: certificación inviable y riesgos abiertos.",
        fix: ["Se pospuso la auditoría para evitar documentar brechas.", "Cumplir 9.2/10.2: auditar, registrar hallazgos y ejecutar acciones correctivas.", "CISO + Dirección", "2026-12-22"],
        fb: "Cláusulas 9.2 y 10.2 obligan a auditar y actuar; la 6.1 exige mantener el riesgo bajo control. Posponer no elimina el riesgo, solo la evidencia."
      }
    ]
  }
];

/* ===== DOI · Ejemplo de Declaración de Aplicabilidad =====
   La cláusula 6.1.3 d) exige un documento con los controles necesarios,
   su justificación, si se aplican y por qué. Estas filas son un ejemplo didáctico. */
const DOI_ROWS = [
  { id: "A.5.9", applies: "Sí", just: "Los activos clínicos y soportes son la base del análisis de riesgo.", state: "Implementado", owner: "CISO", ev: "INV-2026-04" },
  { id: "A.5.23", applies: "Sí", just: "Imagen médica en SaaS con datos de pacientes y subprocesadores.", state: "Parcial", owner: "CISO + Compras", ev: "DPA-2026-02" },
  { id: "A.6.3", applies: "Sí", just: "Todo el personal manipula datos de salud; formación obligatoria.", state: "Implementado", owner: "RRHH + CISO", ev: "LMS-2026-11" },
  { id: "A.7.4", applies: "No", just: "Sala de servidores operada por proveedor certificado; control heredado vía A.5.23 y contrato.", state: "Justificado", owner: "CISO + Gerencia", ev: "CTR-2026-07" },
  { id: "A.8.2", applies: "Sí", just: "Administradores de plataforma clínica y base de datos.", state: "Parcial", owner: "CISO", ev: "PAM-2026-03" },
  { id: "A.8.8", applies: "Sí", just: "Portal de pacientes expuesto a internet y CVE explotadas.", state: "Implementado", owner: "SecOps", ev: "VULN-2026-18" },
  { id: "A.8.13", applies: "Sí", just: "Historia clínica y resultados: RTO 4 h, RPO 1 h.", state: "Parcial", owner: "Infraestructura", ev: "BKP-2026-05" },
  { id: "A.8.16", applies: "Sí", just: "SIEM con alertas de accesos anómalos y DLP.", state: "Implementado", owner: "SOC", ev: "MON-2026-09" },
  { id: "A.8.28", applies: "Sí", just: "Desarrollo interno del portal y APIs FHIR.", state: "Planificado", owner: "Desarrollo", ev: "SDLC-2027-01" },
  { id: "A.5.34", applies: "Sí", just: "Datos de salud: categoría especial del RGPD.", state: "Implementado", owner: "DPO", ev: "PRIV-2026-06" }
];

const CLAUSES = [
  { n: "4", t: "Contexto de la organización", d: "Entender la organización y su contexto, las partes interesadas, definir el alcance y establecer el SGSI.", k: ["4.1 Contexto interno y externo", "4.2 Partes interesadas", "4.3 Alcance del SGSI", "4.4 Sistema de gestión"] },
  { n: "5", t: "Liderazgo", d: "La dirección debe liderar, aprobar la política y asignar roles. No puede delegar el gobierno del SGSI.", k: ["5.1 Liderazgo y compromiso", "5.2 Política de seguridad", "5.3 Roles y responsabilidades"] },
  { n: "6", t: "Planificación", d: "Gestionar riesgos y oportunidades, evaluar el riesgo, decidir el tratamiento y fijar objetivos medibles.", k: ["6.1 Riesgos y oportunidades", "6.1.2 Evaluación del riesgo", "6.1.3 Tratamiento y DOI", "6.2 Objetivos de seguridad"] },
  { n: "7", t: "Apoyo", d: "Aportar recursos, competencia, concienciación, comunicación e información documentada.", k: ["7.1 Recursos", "7.2 Competencia", "7.3 Concienciación", "7.4 Comunicación", "7.5 Información documentada"] },
  { n: "8", t: "Operación", d: "Planificar y controlar los procesos, ejecutar la evaluación y el tratamiento de riesgos.", k: ["8.1 Planificación y control", "8.2 Evaluación del riesgo", "8.3 Tratamiento del riesgo"] },
  { n: "9", t: "Evaluación del desempeño", d: "Medir, auditar internamente y revisar el SGSI por la dirección.", k: ["9.1 Seguimiento y medición", "9.2 Auditoría interna", "9.3 Revisión por la dirección"] },
  { n: "10", t: "Mejora", d: "Corregir no conformidades, analizar causas, verificar eficacia y mejorar de forma continua.", k: ["10.1 Generalidades", "10.2 No conformidad y acción correctiva", "10.3 Mejora continua"] }
];
