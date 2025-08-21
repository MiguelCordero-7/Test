 <script>
        const questions = [
            // Nage questions (6)
            { text: "Prefiero seguir reglas claras y establecidas antes que improvisar", aura: "nage" },
            { text: "La justicia debe aplicarse de manera equilibrada sin favorecimientos", aura: "nage" },
            { text: "Me siento más cómodo cuando hay orden y estructura en mi entorno", aura: "nage" },
            { text: "Creo que cada acción debe tener una consecuencia proporcional", aura: "nage" },
            { text: "Valoro más la estabilidad que los cambios constantes", aura: "nage" },
            { text: "Prefiero construir algo duradero que algo espectacular pero temporal", aura: "nage" },

            // Vilet questions (6)
            { text: "Necesito tiempo a solas para recargar mis energías", aura: "vilet" },
            { text: "Prefiero espacios pequeños e íntimos que grandes multitudes", aura: "vilet" },
            { text: "Mi habitación/espacio personal es mi refugio más importante", aura: "vilet" },
            { text: "Evito situaciones donde tenga que exponer demasiado de mí mismo", aura: "vilet" },
            { text: "Me siento más auténtico cuando estoy en mi propio espacio", aura: "vilet" },
            { text: "Prefiero observar antes que ser el centro de atención", aura: "vilet" },

            // Rod questions (6)
            { text: "Cuando siento algo, lo siento con mucha intensidad", aura: "rod" },
            { text: "Prefiero vivir experiencias fuertes que una vida tranquila", aura: "rod" },
            { text: "Me gusta sentir adrenalina y emociones al límite", aura: "rod" },
            { text: "Cuando me enojo, mi reacción suele ser intensa", aura: "rod" },
            { text: "No me conformo con términos medios, voy por todo o nada", aura: "rod" },
            { text: "Prefiero una vida apasionada aunque sea inestable", aura: "rod" },

            // Gerd questions (6)
            { text: "Busco armonía y paz en mis relaciones", aura: "gerd" },
            { text: "Prefiero evitar conflictos y encontrar puntos en común", aura: "gerd" },
            { text: "Me siento conectado con la naturaleza y los ciclos naturales", aura: "gerd" },
            { text: "Creo en el fluir de la vida sin forzar las situaciones", aura: "gerd" },
            { text: "Valoro la tranquilidad y la serenidad por encima de la acción", aura: "gerd" },
            { text: "Prefiero ser un mediador que un confrontador", aura: "gerd" },

            // Amow questions (6)
            { text: "Necesito entender las causas de las cosas antes de actuar", aura: "amow" },
            { text: "Prefiero basar mis decisiones en lógica y evidencia", aura: "amow" },
            { text: "Disfruto analizando y comprendiendo sistemas complejos", aura: "amow" },
            { text: "Busco la verdad por encima de las apariencias", aura: "amow" },
            { text: "Me gusta enseñar y compartir conocimiento con otros", aura: "amow" },
            { text: "Prefiero conversaciones profundas que charla superficial", aura: "amow" },

            // Ros questions (6)
            { text: "Me siento cómodo tomando decisiones que otros evitan", aura: "ros" },
            { text: "Sé cómo influir en las personas para lograr objetivos", aura: "ros" },
            { text: "Prefiero tener control sobre las situaciones importantes", aura: "ros" },
            { text: "Entiendo que el poder es necesario para crear cambios reales", aura: "ros" },
            { text: "Puedo ser estratégico incluso en situaciones personales", aura: "ros" },
            { text: "Creo que algunos conocimientos deben compartirse selectivamente", aura: "ros" }
        ];

        let currentQuestion = 0;
        let answers = [];

        function initializeTest() {
            displayQuestion();
            updateProgress();
        }

        function displayQuestion() {
            const questionText = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options');
            
            questionText.textContent = `${currentQuestion + 1}. ${questions[currentQuestion].text}`;
            
            const options = [
                'Totalmente en desacuerdo',
                'En desacuerdo',
                'Neutral',
                'De acuerdo',
                'Totalmente de acuerdo'
            ];
            
            optionsContainer.innerHTML = '';
            options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.onclick = () => selectOption(index + 1);
                
                if (answers[currentQuestion] === index + 1) {
                    optionElement.classList.add('selected');
                }
                
                optionsContainer.appendChild(optionElement);
            });
            
            updateNavigationButtons();
        }

        function selectOption(value) {
            answers[currentQuestion] = value;
            
            // Update visual selection
            const options = document.querySelectorAll('.option');
            options.forEach((option, index) => {
                option.classList.toggle('selected', index === value - 1);
            });
            
            updateNavigationButtons();
        }

        function updateNavigationButtons() {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const finishBtn = document.getElementById('finish-btn');
            
            prevBtn.disabled = currentQuestion === 0;
            nextBtn.disabled = answers[currentQuestion] === undefined;
            
            if (currentQuestion === questions.length - 1) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = answers[currentQuestion] !== undefined ? 'block' : 'none';
            } else {
                nextBtn.style.display = 'block';
                finishBtn.style.display = 'none';
            }
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                displayQuestion();
                updateProgress();
            }
        }

        function nextQuestion() {
            if (currentQuestion < questions.length - 1 && answers[currentQuestion] !== undefined) {
                currentQuestion++;
                displayQuestion();
                updateProgress();
            }
        }

        function updateProgress() {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            document.getElementById('progress').style.width = progress + '%';
        }

        function calculateResults() {
            const scores = {
                nage: 0, vilet: 0, rod: 0, gerd: 0, amow: 0, ros: 0
            };

            // Calculate scores
            answers.forEach((answer, index) => {
                const aura = questions[index].aura;
                scores[aura] += answer;
            });

            // Convert to percentages
            const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
            const percentages = {};
            
            Object.keys(scores).forEach(aura => {
                percentages[aura] = Math.round((scores[aura] / totalScore) * 100);
            });

            // Determine final aura
            const result = determineAura(percentages);
            
            displayResults(result, percentages);
        }

        function determineAura(percentages) {
            // Sort auras by percentage
            const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
            const highest = sorted[0];
            const second = sorted[1];
            const third = sorted[2];

            // If one aura is 80% or more, it's absolute
            if (highest[1] >= 80) {
                return { type: 'absolute', aura: highest[0], name: getAuraName(highest[0]) };
            }

            // Check for hybrid combinations (Navi, Gerod, Amros)
            const hybridCombos = {
                'nage-vilet': 'navi',
                'vilet-nage': 'navi',
                'gerd-rod': 'gerod',
                'rod-gerd': 'gerod',
                'amow-ros': 'amros',
                'ros-amow': 'amros'
            };

            const combo = `${highest[0]}-${second[0]}`;
            if (hybridCombos[combo] && highest[1] >= 40 && second[1] >= 40) {
                // Check if it's mixed (third component >= 20%)
                if (third[1] >= 20) {
                    return { 
                        type: 'mixed', 
                        aura: `${hybridCombos[combo]}_${third[0]}`, 
                        name: getMixedAuraName(hybridCombos[combo], third[0]),
                        components: [highest[0], second[0], third[0]]
                    };
                } else {
                    return { 
                        type: 'hybrid', 
                        aura: hybridCombos[combo], 
                        name: getHybridAuraName(hybridCombos[combo]),
                        components: [highest[0], second[0]]
                    };
                }
            }

            // Default to highest scoring aura
            return { type: 'absolute', aura: highest[0], name: getAuraName(highest[0]) };
        }

        function getAuraName(aura) {
            const names = {
                nage: 'Nage',
                vilet: 'Vilet',
                rod: 'Rod',
                gerd: 'Gerd',
                amow: 'Amow',
                ros: 'Ros'
            };
            return names[aura];
        }

        function getHybridAuraName(hybrid) {
            const names = {
                navi: 'Navi',
                gerod: 'Gerod',
                amros: 'Amros'
            };
            return names[hybrid];
        }

        function getMixedAuraName(hybrid, third) {
            const hybridNames = {
                navi: 'Navi',
                gerod: 'Gerod',
                amros: 'Amros'
            };
            const thirdNames = {
                nage: 'Nage',
                vilet: 'Vilet',
                rod: 'Rod',
                gerd: 'Gerd',
                amow: 'Amow',
                ros: 'Ros'
            };
            return `${hybridNames[hybrid]} ${thirdNames[third]}`;
        }

        function displayResults(result, percentages) {
            document.getElementById('test-content').style.display = 'none';
            const resultsContainer = document.getElementById('results');
            resultsContainer.style.display = 'block';

            // Apply theme
            applyAuraTheme(result);

            resultsContainer.innerHTML = `
                <div class="aura-result">
                    <div class="aura-name">${result.name}</div>
                    <p style="font-size: 1.2em; margin-bottom: 20px;">
                        ${getAuraTypeDescription(result.type)}
                    </p>
                </div>

                <div class="percentages">
                    ${Object.entries(percentages).map(([aura, percentage]) => 
                        `<div class="percentage-item">
                            <strong>${getAuraName(aura)}</strong><br>
                            ${percentage}%
                        </div>`
                    ).join('')}
                </div>

                ${getAuraInformation(result)}

                <button class="btn restart-btn" onclick="restartTest()">Realizar Test Nuevamente</button>
            `;
        }

        function applyAuraTheme(result) {
            const body = document.body;
            body.className = ''; // Clear existing classes
            
            // Determine primary aura for theming
            let primaryAura = result.aura;
            if (result.type === 'mixed' || result.type === 'hybrid') {
                // Use first component for theming
                if (result.components && result.components.length > 0) {
                    primaryAura = result.components[0];
                } else {
                    // Extract from aura name
                    if (result.aura.includes('navi')) primaryAura = 'nage';
                    else if (result.aura.includes('gerod')) primaryAura = 'gerd';
                    else if (result.aura.includes('amros')) primaryAura = 'amow';
                }
            }
            
            body.classList.add(`${primaryAura}-theme`);
        }

        function getAuraTypeDescription(type) {
            const descriptions = {
                absolute: 'Tu aura es pura y definida, representando una energía concentrada y poderosa.',
                hybrid: 'Tu aura es híbrida, combinando dos fuerzas fundamentales en perfecta síntesis.',
                mixed: 'Tu aura es mixta, integrando múltiples dimensiones en un arquetipo complejo y único.'
            };
            return descriptions[type];
        }

        function getAuraInformation(result) {
            // This would contain all the detailed information about each aura
            // For brevity, I'll include a few examples. In the full implementation,
            // you would include all the detailed information from your document

            const auraInfo = {
                nage: {
                    description: "Nage se caracteriza por un profundo respeto hacia la estabilidad, el equilibrio y la responsabilidad. Su visión de la vida no se basa en extremos, sino en el justo medio.",
                    amor: "Para Nage, el amor es una construcción compleja que se edifica con paciencia, compromiso y claridad. No busca el amor superficial, sino una unión basada en respeto, confianza y madurez emocional.",
                    poder: "La justicia para Nage no es venganza ni imposición de poder, sino mantener el balance entre las acciones y sus consecuencias.",
                    social: "En la sociedad, Nage es el mediador que mantiene la armonía en su entorno. Prefiere construir consensos antes que imponer voluntades.",
                    miedo: "El miedo, para Nage, es un recordatorio de lo frágil que es la estabilidad. No lo niega, pero tampoco le permite gobernar su vida.",
                    liderazgo: "Su liderazgo se distingue por su vocación de servicio. No busca la autoridad como un fin en sí mismo, sino como un medio para garantizar la seguridad y la prosperidad de su gente.",
                    pecados: "Nage se opone a todos los excesos. Ve cada pecado capital como un desequilibrio que rompe la armonía necesaria para una vida plena.",
                    personajes: "Representado en figuras que valoran el equilibrio y la justicia como principios fundamentales."
                },
                
                vilet: {
                    description: "El aura Vilet se define por su fuerte orientación hacia lo individual y la libertad. Es el habitante de la 'cueva', alguien que considera su espacio personal como el refugio donde encuentra verdadera libertad.",
                    amor: "El amor para Vilet es complejo. No lo rechaza, pero tampoco lo idealiza. Puede establecer vínculos, siempre y cuando no comprometan su independencia.",
                    poder: "El Vilet no se interesa por liderar en el sentido tradicional. Su liderazgo es silencioso: ejercer influencia desde su coherencia y no desde la imposición.",
                    social: "En la sociedad, Vilet es más bien asocial. Prefiere entornos pequeños, relaciones selectas y espacios donde no tenga que forzar su interacción.",
                    miedo: "El miedo principal de Vilet es perder su refugio, su espacio íntimo. Lo aterra que lo obliguen a vivir bajo las reglas de otros.",
                    liderazgo: "Puede asumir responsabilidades si la situación lo exige, pero siempre desde un rol práctico, no jerárquico.",
                    pecados: "Los pecados en Vilet se manifiestan como refugio en pequeños placeres íntimos, desde la privacidad y evitando la exposición.",
                    personajes: "Representado en figuras introspectivas que valoran su autonomía por encima de todo."
                },

                rod: {
                    description: "El aura Rod representa la fuerza volcánica del instinto y la intensidad. Es el contrapunto de Gerd: mientras este busca fluir en calma, Rod fluye en erupciones.",
                    amor: "En el amor, Rod es volcánico. Ama con fuerza, sin reservas, sin cálculos. Entrega su pasión por completo, pero esa misma intensidad lo hace demandante y a veces inestable.",
                    poder: "Como líder, Rod inspira por carisma y fuerza. Es un líder de batalla, de acción, más que de estrategia fría.",
                    social: "En lo social, Rod busca intensidad. Ama las fiestas, los deportes extremos, los lugares donde la energía esté al máximo.",
                    miedo: "El miedo de Rod se manifiesta en perder la intensidad que lo define. Teme volverse irrelevante, débil, incapaz de sentir con fuerza.",
                    liderazgo: "Su liderazgo es carismático pero impulsivo. Sus seguidores lo admiran por su valentía, pero pueden temer sus arrebatos.",
                    pecados: "En Rod, todos los pecados se viven con intensidad máxima. La lujuria es ardiente, la ira volcánica, la gula insaciable.",
                    personajes: "Tony Montana, Anakin Skywalker - figuras que viven al extremo y temen perder su intensidad."
                },

                gerd: {
                    description: "El aura Gerd se caracteriza por un eje fundamental: la paz y la armonía. Su lema es 'fluir con la vida', buscando equilibrio y conexión con lo natural.",
                    amor: "En el amor, un Gerd busca estabilidad, ternura y conexión espiritual. Es sensible y se entrega con suavidad, pero teme rupturas porque perturban su paz interna.",
                    poder: "El Gerd no busca liderar de manera autoritaria. Su estilo de liderazgo es cooperativo y armonizador.",
                    social: "En la sociedad, el Gerd suele ser un ser conciliador, alguien que escucha y genera confianza. Es bien recibido porque transmite calma.",
                    miedo: "Temor a la confrontación directa y miedo a perder la paz que lo sostiene. Rechazo a ambientes caóticos o demasiado agresivos.",
                    liderazgo: "Su liderazgo es cooperativo, enfocado en mantener la tranquilidad grupal y apaciguar tensiones.",
                    pecados: "El Gerd evita todos los excesos. Su mayor riesgo es confundir 'fluir' con 'no actuar', cayendo en la postergación disfrazada de serenidad.",
                    personajes: "Figuras que representan la sabiduría serena y la conexión con la naturaleza."
                },

                amow: {
                    description: "Amow representa la lógica y la racionalidad llevadas al extremo. Es el buscador incansable de la verdad mediante el análisis, la comprobación y la reflexión.",
                    amor: "Amow concibe el amor como un terreno para el entendimiento mutuo. Para él, amar implica comprender, escuchar y construir desde la lógica de dos realidades distintas.",
                    poder: "El liderazgo de Amow se ejerce desde la razón. Prefiere convencer con argumentos y evidencias antes que con imposiciones.",
                    social: "En lo social, Amow no busca ser el centro de atención, pero sí disfruta de conversaciones profundas. Brilla en espacios donde puede debatir y enseñar.",
                    miedo: "El miedo central de Amow es la ignorancia y la manipulación. Teme que la verdad sea ocultada y que la mentira se imponga.",
                    liderazgo: "Es un líder que inspira confianza porque fundamenta sus decisiones, aunque puede ser percibido como distante en lo emocional.",
                    pecados: "Su avaricia es intelectual - acumula libros, ideas y teorías. Su ira aparece ante la irracionalidad y el engaño.",
                    personajes: "Figuras que representan la búsqueda racional de la verdad y el conocimiento."
                },

                ros: {
                    description: "El aura Ros representa la manifestación más calculadora y estratégica. Es el arquetipo del estratega que busca poder, control y dominio a través del conocimiento y la influencia.",
                    amor: "Ros ve el amor como un contrato social, un espacio donde se mide el poder de influencia. En una relación, puede mostrarse atento y carismático, pero en el fondo busca el control.",
                    poder: "Ros respira poder. No lo concibe como una herramienta altruista, sino como el fin mismo. Para él, liderar significa dirigir desde arriba con autoridad.",
                    social: "En el ámbito social, Ros proyecta una imagen calculada y pulida. Sabe cómo adaptarse a diferentes círculos, usando cada interacción como un tablero de ajedrez.",
                    miedo: "El mayor temor de Ros es ser desenmascarado. Teme que su máscara de perfección se rompa y que los demás descubran su vulnerabilidad.",
                    liderazgo: "Su liderazgo se basa en la estrategia y el control de la información. Prefiere mantener a otros bajo su influencia mediante la dependencia.",
                    pecados: "En Ros, la lujuria se usa como herramienta de manipulación, la avaricia acumula secretos como capital, y la soberbia es su pecado dominante.",
                    personajes: "Figuras que representan el poder estratégico y la manipulación calculada."
                },

                // Hybrid auras
                navi: {
                    description: "El aura Navi representa la unión de la apertura de Nage con la introspección de Vilet. Es el espíritu pirata: impredecible, magnético y profundamente humano.",
                    amor: "Para Navi, el amor no es una cadena ni una promesa eterna, sino un viaje compartido. Ama intensamente, pero su amor es como el mar: profundo, cambiante y difícil de contener.",
                    poder: "Navi no busca poder absoluto, sino el poder de mantenerse libre. Cuando asume poder, lo entiende como la capacidad de mantener abierto el horizonte propio y el de los demás.",
                    social: "Socialmente, Navi es encantador y difícil de clasificar. Puede ser tanto el centro de atención como el viajero solitario, siempre adaptable pero necesitando momentos de soledad.",
                    miedo: "Su mayor temor es perder su libertad y ser encadenado por estructuras rígidas o relaciones posesivas.",
                    liderazgo: "En el rol de líder, inspira desde el ejemplo y el carisma. Sus seguidores lo ven como alguien auténtico que no predica con teorías sino con su vida misma.",
                    pecados: "La soberbia se manifiesta en su orgullo por vivir libremente, la avaricia no es material sino de experiencias, y la lujuria es intensidad sin miedo a los excesos.",
                    personajes: "Jack Sparrow, Han Solo, Che Guevara - figuras que encarnan la libertad como brújula y el caos como compañero."
                },

                gerod: {
                    description: "Gerod surge como la unión entre Gerd y Rod. Es el 'Chamán Guerrero' que combina contemplación y fuerza, tranquilo cuando lo requiere pero imparable en momentos decisivos.",
                    amor: "El amor, para Gerod, es un lazo profundo y enraizado en lo vital. Buscan relaciones donde exista confianza, cuidado y respeto por los ritmos naturales.",
                    poder: "El poder para Gerod no es un fin, sino un medio para proteger, sanar y transformar. Ejerce el poder como guía, estratega y protector.",
                    social: "Se desenvuelve como una figura de respeto silencioso. No buscan ser el centro de atención, pero su presencia es reconocida por la serenidad que transmiten.",
                    miedo: "Teme los ambientes demasiado caóticos que rompan su conexión espiritual y la armonía que busca mantener.",
                    liderazgo: "Su liderazgo combina sabiduría ancestral con determinación práctica. Es un guardián que acompaña y lidera cuando es necesario.",
                    pecados: "Pueden mostrar soberbia espiritual creyéndose poseedores de una verdad superior. La ira puede surgir con fuerza, pero controlada por su sabiduría.",
                    personajes: "Gandalf, Geralt de Rivia, Miyamoto Musashi - figuras que unen contemplación con combate cuando es necesario."
                },

                amros: {
                    description: "Amros surge de la unión de Amow y Ros. Es el maestro prudente, el guardián del conocimiento que entiende que la verdad debe compartirse selectivamente.",
                    amor: "En el amor, Amros es reservado, cuidadoso y selectivo. Prefiere las relaciones profundas y duraderas, considerando que el amor debe entregarse en el momento adecuado.",
                    poder: "El poder, para Amros, es un arma de doble filo. No lo busca para dominar, sino para custodiar. Su papel es el de guardián del saber.",
                    social: "Socialmente, se mueve en círculos reducidos y selectivos. No es un líder de masas, sino un consejero y guía silencioso en grupos pequeños.",
                    miedo: "Teme que el conocimiento sea mal utilizado o caiga en manos incorrectas. Su prudencia nace del miedo a las consecuencias de la sabiduría mal aplicada.",
                    liderazgo: "Su liderazgo es hermético y selectivo. Enseña solo a quienes considera preparados y en el momento que considera adecuado.",
                    pecados: "Su mayor riesgo es la soberbia, creyéndose superior por guardar verdades ocultas. La avaricia se manifiesta como celos por el conocimiento.",
                    personajes: "Yoda, Sócrates, Dumbledore - maestros que guardan secretos y revelan sabiduría solo cuando es apropiado."
                },

                // Mixed auras examples
                navi_amow: {
                    description: "El Visionario combina la libertad de Navi con la lógica de Amow. Tiende a confundir amor con idealización y puede ver en otros reflejos de sus sueños.",
                    amor: "Sabe seducir con palabras, proyectos y promesas de futuro, pero corre el riesgo de no cumplirlas. Si madura, el amor se convierte en complicidad creativa.",
                    poder: "Su visión lo hace atreverse donde otros no. No es un poder basado en fuerza, sino en proyección de futuro, en hacer que otros crean en lo que él cree.",
                    social: "Es un personaje magnético y polémico: amado por unos como soñador revolucionario, criticado por otros como charlatán.",
                    miedo: "Teme que lo expongan como un farsante o que sus visiones no se materialicen, perdiendo credibilidad.",
                    liderazgo: "Lidera inspirando con visiones de futuro, pero puede fallar en la ejecución práctica de sus ideas.",
                    pecados: "La soberbia lo hace creer superior por sus sueños, aunque no tenga pruebas. Tiende a soñar más que a ejecutar.",
                    personajes: "Oscar (Espanta Tiburones), visionarios que pasan de ser aclamados a ser criticados cuando sus promesas no se cumplen."
                },

                navi_gerd: {
                    description: "El Guardián de la Comunidad fusiona la libertad de Navi con el espíritu protector de Gerd. Busca no solo su independencia personal, sino la estabilidad de su comunidad.",
                    amor: "Se muestra protector y comprometido. Valora la lealtad y la sinceridad por encima de la pasión fugaz. Su amor se manifiesta en el acompañamiento.",
                    poder: "Su liderazgo se distingue por su vocación de servicio. No busca autoridad como fin, sino como medio para garantizar seguridad y prosperidad.",
                    social: "Es el mediador que mantiene la armonía. Prefiere construir consensos antes que imponer voluntades. Sostiene la estructura invisible de la comunidad.",
                    miedo: "Teme las amenazas directas a su comunidad y los cambios que pongan en riesgo la estabilidad que ha construido.",
                    liderazgo: "Lidera con prudencia, evitando excesos y promoviendo decisiones que fortalezcan la cohesión social.",
                    pecados: "Puede caer en sobreprotección o control excesivo. Su resistencia al cambio puede confundirse con pereza.",
                    personajes: "Líderes comunitarios que balancean libertad individual con responsabilidad colectiva."
                }
            };

            // Get the appropriate information based on the result
            let info;
            if (result.type === 'absolute') {
                info = auraInfo[result.aura];
            } else if (result.type === 'hybrid') {
                info = auraInfo[result.aura];
            } else if (result.type === 'mixed') {
                // For mixed auras, try to find specific info or use hybrid as fallback
                const mixedKey = result.aura.replace(' ', '_').toLowerCase();
                info = auraInfo[mixedKey] || auraInfo[result.aura.split('_')[0]] || auraInfo.navi_amow;
            }

            if (!info) {
                info = {
                    description: "Tu aura representa una combinación única de energías que define tu personalidad y forma de ver el mundo.",
                    amor: "Tu enfoque del amor combina múltiples dimensiones, creando relaciones complejas y profundas.",
                    poder: "Tu relación con el poder refleja la síntesis de diferentes filosofías y enfoques de liderazgo.",
                    social: "En lo social, manifiestas una combinación única de traits que te hace distintivo.",
                    miedo: "Tus temores reflejan la complejidad de tu naturaleza multifacética.",
                    liderazgo: "Tu estilo de liderazgo integra diferentes enfoques según la situación lo requiera.",
                    pecados: "Tus tentaciones y debilidades reflejan la tensión entre diferentes aspectos de tu personalidad.",
                    personajes: "Encuentras resonancia con figuras que también representan complejidad y síntesis."
                };
            }

            return `
                <div class="info-section">
                    <h3>🌟 Esencia de tu Aura</h3>
                    <p>${info.description}</p>
                </div>

                <div class="info-section">
                    <h3>❤️ Amor y Relaciones</h3>
                    <p>${info.amor}</p>
                </div>

                <div class="info-section">
                    <h3>👑 Poder y Autoridad</h3>
                    <p>${info.poder}</p>
                </div>

                <div class="info-section">
                    <h3>🤝 Dimensión Social</h3>
                    <p>${info.social}</p>
                </div>

                <div class="info-section">
                    <h3>😨 Miedos Fundamentales</h3>
                    <p>${info.miedo}</p>
                </div>

                <div class="info-section">
                    <h3>🎯 Estilo de Liderazgo</h3>
                    <p>${info.liderazgo}</p>
                </div>

                <div class="info-section">
                    <h3>⚠️ Pecados Capitales y Debilidades</h3>
                    <p>${info.pecados}</p>
                </div>

                <div class="info-section">
                    <h3>🎭 Personajes Representativos</h3>
                    <p>${info.personajes}</p>
                </div>
            `;
        }

        function restartTest() {
            currentQuestion = 0;
            answers = [];
            document.body.className = '';
            document.body.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
            document.getElementById('test-content').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            initializeTest();
        }

        // Initialize the test when the page loads
        window.onload = function() {
            initializeTest();
        };
    </script>
