// Mostrar u ocultar los campos de adición dependiendo del checkbox
document.getElementById('hasNearVision').addEventListener('change', function() {
    const nearVisionFields = document.getElementById('nearVisionFields');
    if (this.checked) {
        nearVisionFields.style.display = 'block';
    } else {
        nearVisionFields.style.display = 'none';
        // Ocultar y deseleccionar las opciones de multifocales si la adición se oculta
        document.getElementById('multifocalTypeFields').style.display = 'none';
        document.querySelectorAll('input[name="multifocalType"]').forEach(function(elem) {
            elem.checked = false;
        });
    }
});

// Mostrar el campo de presbicia si la edad es >= 45
document.getElementById('age').addEventListener('input', function() {
    const age = parseInt(this.value);
    const presbyopiaField = document.getElementById('presbyopiaField');
    if (age >= 45) {
        presbyopiaField.style.display = 'block';
    } else {
        presbyopiaField.style.display = 'none';
        document.getElementById('presbyopia').checked = false;
    }
});

// Habilitar o deshabilitar el campo de eje si hay cilindro
function toggleAxisField(cylinderInput, axisInput) {
    if (parseFloat(cylinderInput.value) !== 0 && cylinderInput.value !== "") {
        axisInput.disabled = false;
    } else {
        axisInput.value = '';  // Limpiar el valor si no hay cilindro
        axisInput.disabled = true;
    }
}

// Listeners para manejar la lógica de cilindro y eje
document.getElementById('cylinderRight').addEventListener('input', function() {
    toggleAxisField(this, document.getElementById('axisRight'));
});

document.getElementById('cylinderLeft').addEventListener('input', function() {
    toggleAxisField(this, document.getElementById('axisLeft'));
});

// Mostrar u ocultar los campos de tipo de multifocales
document.getElementsByName('nearLensType').forEach(function(elem) {
    elem.addEventListener('change', function() {
        const multifocalTypeFields = document.getElementById('multifocalTypeFields');
        if (this.value === 'multifocales') {
            multifocalTypeFields.style.display = 'block';
        } else {
            multifocalTypeFields.style.display = 'none';
            // Deseleccionar las opciones de multifocalType
            document.querySelectorAll('input[name="multifocalType"]').forEach(function(elem) {
                elem.checked = false;
            });
        }
    });
});

// Función para manejar el envío del formulario
document.getElementById('selectorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener los valores ingresados
    var name = document.getElementById('name').value;
    var age = parseInt(document.getElementById('age').value);

    // Ojo derecho
    var sphereRight = parseFloat(document.getElementById('sphereRight').value) || 0;
    var cylinderRight = parseFloat(document.getElementById('cylinderRight').value) || 0;
    var axisRight = parseFloat(document.getElementById('axisRight').value) || 0;

    // Ojo izquierdo
    var sphereLeft = parseFloat(document.getElementById('sphereLeft').value) || 0;
    var cylinderLeft = parseFloat(document.getElementById('cylinderLeft').value) || 0;
    var axisLeft = parseFloat(document.getElementById('axisLeft').value) || 0;

    var hasNearVision = document.getElementById('hasNearVision').checked;
    var addNear = hasNearVision ? parseFloat(document.getElementById('addNear').value) || 0 : null;
    var lensType = document.querySelector('input[name="nearLensType"]:checked') ? document.querySelector('input[name="nearLensType"]:checked').value : null;
    var hasMyopia = document.getElementById('myopia').checked;
    var hasHypermetropia = document.getElementById('hypermetropia').checked;
    var hasAstigmatism = document.getElementById('astigmatism').checked;
    var usesElectronics = document.getElementById('electronics').checked;
    var usesForDriving = document.getElementById('driving').checked;
    var selectedSport = document.getElementById('sports').value;

    // Obtener el tipo de multifocal si aplica
    var multifocalType = null;
    if (lensType === "multifocales") {
        var multifocalTypeElem = document.querySelector('input[name="multifocalType"]:checked');
        multifocalType = multifocalTypeElem ? multifocalTypeElem.value : null;
    }

    // Función para formatear los valores con el signo adecuado
    function formatValue(value) {
        if (value > 0) return `+${value.toFixed(2)}`; // Signo positivo
        if (value < 0) return `${value.toFixed(2)}`;  // Signo negativo
        return '0.00';  // Valor cero
    }

    // Generar el contenido HTML para los resultados
    var resultsHtml = `<h3>Recomendaciones para ${name}:</h3>`;

    // Resultados para el ojo derecho
    var sphereRightText = formatValue(sphereRight) + ' Dpt';
    var cylinderRightText = formatValue(cylinderRight) + ' Dpt';
    var axisRightText = cylinderRight !== 0 ? `${axisRight}°` : '';
    resultsHtml += `<div class="result-item"><strong>Ojo Derecho:</strong> Esfera: ${sphereRightText}, Cilindro: ${cylinderRightText}, Eje: ${axisRightText}</div>`;

    // Resultados para el ojo izquierdo
    var sphereLeftText = formatValue(sphereLeft) + ' Dpt';
    var cylinderLeftText = formatValue(cylinderLeft) + ' Dpt';
    var axisLeftText = cylinderLeft !== 0 ? `${axisLeft}°` : '';
    resultsHtml += `<div class="result-item"><strong>Ojo Izquierdo:</strong> Esfera: ${sphereLeftText}, Cilindro: ${cylinderLeftText}, Eje: ${axisLeftText}</div>`;

    // Si se ingresó adición, calcular la graduación de cerca sumando la adición a la esfera de lejos
    if (hasNearVision && addNear !== null) {
        var sphereNearRight = sphereRight + addNear;
        var sphereNearLeft = sphereLeft + addNear;
        var sphereNearRightText = formatValue(sphereNearRight) + ' Dpt';
        var sphereNearLeftText = formatValue(sphereNearLeft) + ' Dpt';
        resultsHtml += `<div class="result-item"><strong>Graduación de Cerca:</strong></div>`;
        resultsHtml += `<div class="result-item">Ojo Derecho: ${sphereNearRightText}, Ojo Izquierdo: ${sphereNearLeftText}</div>`;
    }

    // Recomendación de tratamiento antirreflejo (con descripción completa)
    resultsHtml += `<div class="result-item"><strong>Tratamiento Antirreflejo:</strong> 
        Los lentes antirreflejos (también llamado "AR10") mejoran la visión, reducen el cansancio ocular y brindan mayor atractivo a tus anteojos. 
        Estos beneficios provienen de la capacidad del lente AR10 o antireflex de prácticamente eliminar los reflejos de las superficies anterior y posterior de los cristales.
    </div>`;

    // Recomendación de Cristales Blue Light Cut si corresponde (con descripción completa)
    if (hasNearVision || usesElectronics) {
        resultsHtml += `<div class="result-item"><strong>Cristales Blue Light Cut:</strong> 
            Son cristales que tienen un tratamiento que bloquea la luz azul que emite las pantallas de dispositivos electrónicos como celulares, tablets, monitores y televisores. 
            Este tipo de cristales ayudan a evitar la fatiga ocular y a proteger los ojos de los daños que puede causar la exposición prolongada a las pantallas.
        </div>`;
    }

    // Recomendaciones según el tipo de lentes indicados
    if (lensType === "bifocales") {
        resultsHtml += `<div class="result-item"><strong>Bifocales:</strong> 
            Se recomiendan lentes bifocales que permiten ver claramente tanto de cerca como de lejos, con una división visible entre las dos áreas de enfoque.
        </div>`;
    } else if (lensType === "multifocales") {
        if (multifocalType === "convencional") {
            resultsHtml += `<div class="result-item"><strong>Multifocales Convencionales:</strong> 
                Se recomiendan lentes multifocales que permiten ver a distancias lejanas, intermedias y cercanas. 
                Son ideales para uso general y se pueden utilizar en la calle, para manejar, etc.
            </div>`;
        } else if (multifocalType === "ocupacional") {
            resultsHtml += `<div class="result-item"><strong>Multifocales Ocupacionales:</strong> 
                Recomendamos cristales multifocales ocupacionales, que son anteojos de media distancia a cerca. 
                Son ideales para usar con la computadora de escritorio y el celular. 
                No se pueden utilizar en la calle o para manejar.
            </div>`;
        } else {
            // Si no seleccionó el tipo de multifocal, mostrar mensaje general
            resultsHtml += `<div class="result-item"><strong>Multifocales:</strong> 
                Se recomiendan lentes multifocales que ofrecen una transición suave entre las distancias de visión, sin una línea visible de separación.
            </div>`;
        }
    } else if (lensType === "noneIndicated" || lensType === "bothIndicated") {
        resultsHtml += `<div class="result-item"><strong>Bifocales y Multifocales:</strong> 
            Puedes optar por lentes bifocales o multifocales según tu preferencia y estilo de vida.
        </div>`;
    }

    // Recomendación de Majestic Myopia si corresponde
    if (age <= 11 && hasMyopia && (sphereRight < 0 || sphereLeft < 0)) {
        resultsHtml += `<div class="result-item"><strong>Majestic Myopia:</strong> 
            La miopía aumenta especialmente durante la niñez y adolescencia, y en uno de cada diez niños miopes crecerá por encima de las 6 dioptrías. 
            Esta condición se llama miopía magna y es una de las mayores causas de patologías que conllevan a discapacidades visuales. 
            El control de miopía incluye más aire libre, tratamientos farmacológicos y lentes multifocales o con desenfoque periférico. 
            Majestic Myopia es una propuesta en lentes aéreos, segura y funcional en todo tipo de actividad.
        </div>`;
    }

    // Recomendación de cristales asféricos (con descripción completa)
    var recommendAspheric = false;
    if (Math.abs(sphereRight) >= 4 || Math.abs(sphereLeft) >= 4) {
        recommendAspheric = true;
    }
    if (hasNearVision && addNear !== null) {
        if (Math.abs(sphereRight + addNear) > 4 || Math.abs(sphereLeft + addNear) > 4) {
            recommendAspheric = true;
        }
    }
    if (recommendAspheric) {
        resultsHtml += `<div class="result-item"><strong>Asfericidad de Cristales:</strong> 
            Recomendamos cristales asféricos a partir de graduaciones esféricas de -4 y +4 porque son cristales con mucho mejor aspecto en el usuario que los utiliza.
            Son más delgados, ligeros y reducen las distorsiones periféricas, ofreciendo una mejor calidad visual y estética.
        </div>`;
    }

    // Recomendación de lentes para manejar si está marcado
    if (usesForDriving) {
        resultsHtml += `<div class="result-item"><strong>Lentes para Manejar:</strong> 
            Opciones para tu caso:<br>
            <strong>Cristales polarizados:</strong> reducen los deslumbramientos y ofrecen un mayor contraste en la calle, su cristal es color gris/negro.<br>
            <strong>Cristales amarillos:</strong> lentes tintados de color amarillo, se usan para manejar de noche. También se pueden usar en noches nubladas o con niebla.
        </div>`;
    }

    // Recomendaciones según el deporte seleccionado (con descripciones completas)
    if (selectedSport) {
        if (selectedSport === "ciclismo") {
            resultsHtml += `<div class="result-item"><strong>Ciclismo o Running:</strong> 
                Filtros Polarizados: Reducen los reflejos en superficies planas, como el asfalto o caminos húmedos.<br>
                Filtros Fotocromáticos: Se oscurecen automáticamente bajo la luz del sol y se aclaran en sombra.<br>
                Filtros de Color (Amarillo o Ámbar): Mejoran el contraste y la percepción de profundidad en condiciones de poca luz o nubosidad.
            </div>`;
        } else if (selectedSport === "nieve") {
            resultsHtml += `<div class="result-item"><strong>Deportes de Nieve:</strong> 
                La atenuación selectiva de la luz azulada aumenta los contrastes y añade claridad a la imagen observada, consiguiéndose mayor comodidad en condiciones de sol intenso y neblina. 
                Mediante el uso de tonos cafés y ámbar, los deportistas aprecian mejor los distintos contornos y texturas de la superficie.
            </div>`;
        } else if (selectedSport === "acuaticos") {
            resultsHtml += `<div class="result-item"><strong>Deportes Acuáticos:</strong> 
                La polarización es indispensable para estos deportes; los reflejos reducen la agudeza visual y la visión de profundidad.
            </div>`;
        } else if (selectedSport === "golf") {
            resultsHtml += `<div class="result-item"><strong>Golf:</strong> 
                La polarización y atenuación de parte de la luz azulada ayuda a mantener la fijación en la pelota. 
                Al reducir la luz azulada, tanto el cielo como la hierba se atenúan, consiguiendo que la bola sea más visible. 
                La polarización elimina el brillo de fondo. Por supuesto, esto afectará la perspectiva al observar los obstáculos de agua.
            </div>`;
        } else if (selectedSport === "tiro") {
            resultsHtml += `<div class="result-item"><strong>Tiro:</strong> 
                Requieren lentes de altos contrastes, porque la caza a menudo tiene lugar a primera hora de la mañana o en condiciones de luz reducida, 
                siendo el color más práctico para los lentes el amarillo.
            </div>`;
        } else if (selectedSport === "raqueta") {
            resultsHtml += `<div class="result-item"><strong>Deportes de Raqueta:</strong> 
                Por seguridad, estos deportes requieren el uso de resinas que superen las pruebas de resistencia al impacto. 
                Se encuentran disponibles con polarizados y pueden obtenerse con revestimientos antirreflejos y de espejo. 
                Los lentes fotocromáticos responden a las necesidades de este deporte, pero el filtro más recomendado es el de color amarillo.
            </div>`;
        }
    }

    // Mostrar los resultados en la página
    document.getElementById('results').innerHTML = resultsHtml;
});

// Función para borrar el formulario
document.getElementById('resetForm').addEventListener('click', function() {
    document.getElementById('selectorForm').reset(); // Resetea el formulario
    document.getElementById('results').innerHTML = ''; // Limpia los resultados
    document.getElementById('nearVisionFields').style.display = 'none'; // Oculta los campos de adición de cerca
    document.getElementById('presbyopiaField').style.display = 'none'; // Oculta el campo de presbicia
    document.getElementById('axisRight').disabled = true; // Deshabilitar el eje derecho
    document.getElementById('axisLeft').disabled = true; // Deshabilitar el eje izquierdo
    document.getElementById('multifocalTypeFields').style.display = 'none'; // Oculta el campo de tipo de multifocal
});

// Función para manejar el clic en el botón "IMPRIMIR"
document.getElementById('printPDF').addEventListener('click', function() {
    // Verificar si hay resultados para imprimir
    if (document.getElementById('results').innerHTML.trim() === '') {
        alert('Por favor, completa el formulario y genera las recomendaciones antes de imprimir.');
        return;
    }

    // Obtener los datos necesarios
    var name = document.getElementById('name').value || 'Usuario';
    var age = document.getElementById('age').value || '';
    var resultsContent = document.getElementById('results').innerHTML;

    // Crear un nuevo documento PDF
    const { jsPDF } = window.jspdf;
    var doc = new jsPDF();

    // Añadir título al PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Recomendaciones para ${name}`, 105, 20, null, null, 'center');

    // Añadir datos personales
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Nombre: ${name}`, 20, 30);
    if (age !== '') {
        doc.text(`Edad: ${age}`, 20, 37);
    }

    // Añadir las recomendaciones
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('Recomendaciones:', 20, 50);

    // Procesar el contenido de resultados y añadirlo al PDF
    var recommendations = document.createElement('div');
    recommendations.innerHTML = resultsContent;

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');

    var yPosition = 60; // Posición vertical inicial
    var lineHeight = 7; // Altura de línea

    // Función para agregar texto con ajuste de línea
    function addMultilineText(text, x, y, maxWidth) {
        var lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
    }

    // Recorrer cada elemento de recomendación y agregarlo al PDF
    var items = recommendations.getElementsByClassName('result-item');
    for (var i = 0; i < items.length; i++) {
        var itemText = items[i].innerText || items[i].textContent;
        yPosition = addMultilineText(itemText, 20, yPosition, 170);
        yPosition += 5; // Espacio adicional entre recomendaciones

        // Verificar si se supera el espacio de la página
        if (yPosition > 280 && i !== items.length - 1) {
            doc.addPage();
            yPosition = 20; // Reiniciar la posición vertical
        }
    }

    // Descargar el PDF
    doc.save(`Recomendaciones_${name}.pdf`);
});
