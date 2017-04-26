var Ejercicio2 = function () {

	//datos de todas las series
	this.juegoDatos=new Array();
	
	//Array de datos para el gráfico de líneas
    this.seriesGLinea = new Array();

	//Array de datos para el gráfico pie Chart
    this.seriesPie = new Array();

    $.ajaxSetup({
        async: false
    });
};

//*****************************************************************************
// Función para recuperar el juego de datos que se encuentra en URL
//*****************************************************************************
Ejercicio2.prototype.cargarDatos = function () {
    var objThis = this;

	//Cargo cada una de las series para el gráfico de líneas con las URL facilitadas
    //serie gráfico de líneas - 1
	$.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data1.json', function (datos) {
    //$.getJSON('/datos/serie1.json', function (datos) {
		objThis.validarAnadirSerie1(datos);
    });

	//serie gráfico de líneas - 2
    $.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data2.json', function (datos) {
	//$.getJSON('/datos/serie2.json', function (datos) {
        objThis.validarAnadirSerie2(datos);
    });

   //serie gráfico de líneas - 2
    $.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data3.json', function (datos) {
	//$.getJSON('/datos/serie3.json', function (datos) {
        objThis.validarAnadirSerie3(datos);
    });
	
	objThis.anadirDatosSeriesGraficos();

	
};

//*****************************************************************************
//Insertamos cada uno de los puntos en una unica serie
//*****************************************************************************
Ejercicio2.prototype.crearSerieJuegoDatos=function (punto)
{
	this.juegoDatos.push(punto);
}

//*****************************************************************************
//Antes de combinar la serie 1 con en el array que contiene el juego de datos 
//para el gráfico de líneas se valida el formato de los datos
//*****************************************************************************
Ejercicio2.prototype.validarAnadirSerie1 = function (serie1) {
    for (var i = 0; i < serie1.length; i++) {
		this.crearSerieJuegoDatos({
            categoria: serie1[i].cat.toUpperCase(), //Categoría en mayúsculas
            fecha: serie1[i].d, 
            valor: serie1[i].value
        });
    }
};

//*****************************************************************************
//Antes de combinar la serie 2 con en el array que contiene el juego de datos 
//para el gráfico de líneas se valida el formato de los datos
//*****************************************************************************
Ejercicio2.prototype.validarAnadirSerie2 = function (serie2) {
    for (var i = 0; i < serie2.length; i++) {
		this.crearSerieJuegoDatos({
            categoria: serie2[i].categ.toUpperCase(),//Categoría en mayúsculas
            fecha: Date.parse(serie2[i].myDate),
            valor: serie2[i].val
        });
    }
};

//*****************************************************************************
//Antes de combinar la serie 3 con en el array que contiene el juego de datos 
//para el gráfico de líneas se valida el formato de los datos
//*****************************************************************************
Ejercicio2.prototype.validarAnadirSerie3 = function (serie3) {
    for (var i = 0; i < serie3.length; i++) {
		//expresion regualar para obtener la fecha que existe dentro del campo "raw"
        var regExFecha = /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/
		
		this.crearSerieJuegoDatos({
            categoria: (serie3[i].raw.split('#'))[1].toUpperCase(), //split para obtener la categoria y la dejamos en mayúsculas
		    fecha: Date.parse(regExFecha.exec(serie3[i].raw)[0]), //utilizamos al expresion regular
			valor: serie3[i].val
        });
    }
};

//*****************************************************************************
//Funcion para obtener los literales de las distintas categorias
//*****************************************************************************
Ejercicio2.prototype.distintasCategorias = function(arr){
    var categorias = [];
    for(var i=0; i < arr.length; i++){
        if(categorias.indexOf(arr[i].categoria) == -1)
              categorias.push(arr[i].categoria);  
    }
    return categorias;
};

//*****************************************************************************
//Funcion para buscar si existe la fecha dentro del array
//val:fecha que se busca en el array
//array: tiene dos campos el primero fecha y el segundo valor
//*****************************************************************************
Ejercicio2.prototype.indiceArray = function (val, array) {
  
  for (var i = 0; i < array.length; i++) 
  {
    if (array[i][0]=== val) 
	{
        return i;
    }
  }
  return -1;
};

//*****************************************************************************
//Función para añadir todos los datos a las series que utilizamos para pintar los gráfico
//*****************************************************************************
Ejercicio2.prototype.anadirDatosSeriesGraficos = function () {
	
	var totalValores=0;
	
	var resumenCategorias = {
            categorias:  new Array(),
            total: 0
        };

	//Lista con las categorias existentes en el juego de pruebas
	//var UniqueCategorias= $.unique(this.juegoDatos.map(function (d) {return d.categoria;}));
	var uniqueCategorias=this.distintasCategorias(this.juegoDatos);
	
	//Se recorre las categorias para crear series de categorias.
	//Sumamos los valores por categoria y fecha coincidente.
	//Calculamos el porcetaje del valor por categoria
	for(var i=0;i<uniqueCategorias.length;i++)
	{
		//nombre de la categoria
		var categoriaBucle=uniqueCategorias[i]
		var auxFecha
		var categoria = {
            name: categoriaBucle,
            total: 0
        };
		
		//Estructura del array para la serie de gráfico en líneas
		this.seriesGLinea.push({
			name: categoriaBucle, //Nombre de la categoria
			data: new Array() //array con el punto donde se define la fecha y valor
		});
		
		//array con todos los datos de la categoria de la iteración en la que estamos ("CAT 1","CAT 2",.....).
		var serieCategoria=$.grep(this.juegoDatos, function( n, i ) {
			return n.categoria===categoriaBucle;
			});
		
		//Ordenamos el array por fechas
		serieCategoria.sort(function (a, b) { return a["fecha"] < b["fecha"] });
		
		
		//Bucle que recorre cada uno de los puntos de la categoria
		//Suma del valor para el total de cada categoria
		var sumaValor=0;
		
		for (var j = 0; j < serieCategoria.length; j++) 
		{
			//Buscamos la fecha de cada uno de los puntos (fecha,valor) de la categoria en el juego de datos que estamos creando para pintar el gráfico de líneas
			//Devuelve el indice de la fecha si ya existe o -1 si no encuentra esa fecha
			var indiceExiste=this.indiceArray(serieCategoria[j].fecha,this.seriesGLinea[i].data)
			
			if (indiceExiste>-1)
			{
				//Como la fecha ha sido encontrada sumamos el valor de este punto al que habia
				this.seriesGLinea[i].data[indiceExiste][1] +=serieCategoria[j].valor;	
			}
			else
			{
				//No existe el fecha en el juego de pruebas y añadimos ese punto
				this.seriesGLinea[i].data.push([serieCategoria[j].fecha,serieCategoria[j].valor]);
			}
			
			categoria.total += serieCategoria[j].valor;
		}
		//Añadimos la categoria con el nombre y su total
		resumenCategorias.categorias.push(categoria);
		//Añadimos el valor de cada categoria al valor total de todos los valores
        resumenCategorias.total += categoria.total;
		
		this.seriesGLinea[i].data.sort(function(a,b){return a[0]>b[0]});
	}
	
	
	//INICIO - Creamos la serie que se pasara al gráfico PIE Chart
	 var seriePieC = {
        name: "Categorias",
        colorByPoint: true,
        data: new Array()
    };
	
	//Recorremos todas las categorias con su total para calcular el porcetanje
	for (var i = 0; i < resumenCategorias.categorias.length; i++) 
	{
		seriePieC.data.push({
            name: resumenCategorias.categorias[i].name,
            y: (resumenCategorias.categorias[i].total / resumenCategorias.total) * 100
        });
	}
	
	//Añadimos el porcejante por categoria a la serie que pasaremos para pintar el grafico
	this.seriesPie.push(seriePieC);
	
	//FIN - Creamos la serie que se pasara al gráfico PIE Chart
};

//*****************************************************************************
//Función para definir las propiedades del Highcharts que cargará los datos del gráfico de líneas
//*****************************************************************************
Ejercicio2.prototype.mostrarLineasHCharts = function (containerId) {

    $("#" + containerId).highcharts({
        title: {
            text: "Grafico en Linea - Ejercicio 2"
        },
		subtitle: {
            text: "Datos agrupados por fecha para cada categoria"
        },
		
		yAxis: {
            title: {
                text: "Valor"
            }
        },
		
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Fecha'
            }
        },
		
		legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
		},
		
        plotOptions: {
            seriesGLinea: {
                stacking: 'normal'
            }
        },
        series: this.seriesGLinea
    });
};

//*****************************************************************************
//Función para definir las propiedades del Highcharts que cargará los datos del gráfico pie chart
//*****************************************************************************
Ejercicio2.prototype.mostrarPieHCharts = function (containerId) {
    $("#" + containerId).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Agrupación por categoria'
        },
        tooltip: {
            pointFormat: '<b>{point.name}:  </b>{point.percentage:.1f}%'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: this.seriesPie
    });
};

